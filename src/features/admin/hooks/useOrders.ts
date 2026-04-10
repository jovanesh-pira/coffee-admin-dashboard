import { useEffect, useState } from "react"
import {
  collection, query, orderBy,
  onSnapshot, doc, getDoc, updateDoc, runTransaction, Timestamp
} from "firebase/firestore"
import { db } from "@/app/firebase/firebase"

export type OrderStatus = "pending" | "completed" | "cancelled"

export type OrderItem = {
  productId: string
  name: string
  image?: string
  unitPrice: number
  qty: number
}

export type Order = {
  id: string
  customerId: string
  customerName: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: Timestamp | null
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db(), "orders"), orderBy("createdAt", "desc"))

    const unsub = onSnapshot(q, async (snap) => {
      const raw = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]

      // fetch unique customer names in parallel
      const uniqueIds = [...new Set(raw.map(o => o.customerId))] as string[]
      const customerMap: Record<string, string> = {}

      await Promise.all(
        uniqueIds.map(async (uid) => {
          const ref = doc(db(), "Customers", uid)
          const snap = await getDoc(ref)
          customerMap[uid] = snap.exists() ? snap.data().fullName : "Unknown"
        })
      )

      setOrders(raw.map(o => ({
        id:           o.id,
        customerId:   o.customerId,
        customerName: customerMap[o.customerId] ?? "Unknown",
        items:        o.items ?? [],
        total:        o.total ?? 0,
        status:       o.status ?? "pending",
        createdAt:    o.createdAt ?? null,
      })))

      setLoading(false)
    })

    return unsub
  }, [])

  return { orders, loading }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orderRef = doc(db(), "orders", orderId)

  if (status === "cancelled") {
    // cancellation = restore stock for every item
    await runTransaction(db(), async (trx) => {
      // ── Phase 1: ALL reads ──────────────────────────────────
      const orderSnap = await trx.get(orderRef)
      if (!orderSnap.exists()) throw new Error("Order not found")

      const items: OrderItem[] = orderSnap.data().items ?? []
      const productSnaps = await Promise.all(
        items.map(item => trx.get(doc(db(), "Products", item.productId)))
      )

      // ── Phase 2: ALL writes ─────────────────────────────────
      // restore stock
      productSnaps.forEach((snap, i) => {
        if (snap.exists()) {
          const currentStock = snap.data().stock ?? 0
          trx.update(snap.ref, { stock: currentStock + items[i].qty })
        }
      })

      // mark order as cancelled
      trx.update(orderRef, { status: "cancelled" })
    })
  } else {
    // completed — just update status, no stock change
    await updateDoc(orderRef, { status })
  }
}
