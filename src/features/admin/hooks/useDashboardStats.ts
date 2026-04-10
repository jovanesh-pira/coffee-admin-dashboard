import { useEffect, useState } from "react"
import { collection, onSnapshot, getCountFromServer, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/app/firebase/firebase"
import type { OrderStatus } from "./useOrders"

type OrderItem = {
  productId: string
  name: string
  qty: number
  unitPrice: number
}

type RawOrder = {
  id: string
  status: OrderStatus
  total: number
  items: OrderItem[]
  customerId: string
  createdAt: any
}

export type RecentCustomer = {
  id: string
  fullName: string
  photoURL: string | null
}

export type DashboardStats = {
  pending: number
  completed: number
  cancelled: number
  total: number
  pendingRevenue: number
  completedRevenue: number
  totalRevenue: number
  customerCount: number
  recentOrders: RecentOrder[]
  recentCustomers: RecentCustomer[]
}

export type RecentOrder = {
  id: string
  customerName: string
  customerId: string
  firstItem: string
  total: number
  status: OrderStatus
}

const EMPTY: DashboardStats = {
  pending: 0,
  completed: 0,
  cancelled: 0,
  total: 0,
  pendingRevenue: 0,
  completedRevenue: 0,
  totalRevenue: 0,
  customerCount: 0,
  recentOrders: [],
  recentCustomers: [],
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Real-time listener on orders — newest first, limited for recent list
    const q = query(collection(db(), "orders"), orderBy("createdAt", "desc"), limit(100))
    const unsub = onSnapshot(q, async (snap) => {
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as RawOrder))

      const pending   = orders.filter(o => o.status === "pending")
      const completed = orders.filter(o => o.status === "completed")
      const cancelled = orders.filter(o => o.status === "cancelled")

      const sum = (list: RawOrder[]) =>
        list.reduce((acc, o) => acc + (o.total ?? 0), 0)

      // Fetch customer count + recent customers with avatars
      let customerCount = 0
      let recentCustomers: RecentCustomer[] = []
      try {
        const [countSnap, customersSnap] = await Promise.all([
          getCountFromServer(collection(db(), "Customers")),
          getDocs(query(collection(db(), "Customers"), limit(5))),
        ])
        customerCount = countSnap.data().count

        // For each customer, try to get their photoURL from the users collection
        recentCustomers = await Promise.all(
          customersSnap.docs.map(async (d) => {
            const fullName: string = d.data().fullName ?? ""
            let photoURL: string | null = null
            try {
              const userSnap = await getDoc(doc(db(), "users", d.id))
              if (userSnap.exists()) photoURL = userSnap.data().photoURL ?? null
            } catch { /* no avatar, use initial */ }
            return { id: d.id, fullName, photoURL }
          })
        )
      } catch {
        // fall back to empty
      }

      // Build recent orders list (last 5 by array order — already DESC from onSnapshot)
      // We'll show the first item name as a summary label
      const recentOrders: RecentOrder[] = orders.slice(0, 5).map(o => {
        const first = o.items?.[0]
        const label = first
          ? `${first.name} × ${first.qty}${o.items.length > 1 ? ` +${o.items.length - 1}` : ""}`
          : "—"
        return {
          id: o.id,
          customerName: o.customerId, // will be enriched separately if needed
          customerId: o.customerId,
          firstItem: label,
          total: o.total ?? 0,
          status: o.status,
        }
      })

      setStats({
        pending:          pending.length,
        completed:        completed.length,
        cancelled:        cancelled.length,
        total:            orders.length,
        pendingRevenue:   sum(pending),
        completedRevenue: sum(completed),
        totalRevenue:     sum(orders),
        customerCount,
        recentOrders,
        recentCustomers,
      })
      setLoading(false)
    })

    return unsub
  }, [])

  return { stats, loading }
}
