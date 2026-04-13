import { useEffect, useState } from "react"
import { collection, onSnapshot, query, orderBy, limit, doc, getDoc, Timestamp } from "firebase/firestore"
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
  createdAt: Timestamp
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
  const [listOrder,setOrders]=useState<RawOrder[]>([])
  function make_ListFilter(list:RawOrder[],ifState:OrderStatus):RawOrder[]{
    return list.filter(order=>{if(order.status===ifState)return order})
  }
  function sum_orders(list:RawOrder[]){
    return list.reduce((acc,o:RawOrder)=>{return acc+o.total},0)
  }
  useEffect(() => {
  
     let q_order=query(collection(db(),"orders"),orderBy("createdAt","desc"),limit(100)) // just give me the 100 news orders 
     var unsub_orders=onSnapshot(q_order,async(snap)=>{
      let raw_data_orders=snap.docs.map(order=>{
        return ({id:order.id,...order.data()}) as RawOrder
      })
      setOrders(raw_data_orders)
 // this part is WTF ------------------->
   var recent_order_list= await Promise.all(
  raw_data_orders.slice(0, 6).map(async (o) => {
    let customerName = "Unknown"
    try {
      const customerSnap = await getDoc(doc(db(), "Customers", o.customerId))
      if (customerSnap.exists()) {
        customerName = customerSnap.data().fullName ?? "Unknown"
      }
    } catch { /* keep Unknown */ }

    return {
      id: o.id,
      status: o.status,
      total: o.total,
      customerId: o.customerId,
      firstItem: o.items?.[0]?.name ?? "—",
      customerName,
    }
  })
)
// ----------------------->
      setStats(prev=>{
        return{
          ...prev,
          total:raw_data_orders.length,
          pending:make_ListFilter(raw_data_orders,"pending").length,
          completed:make_ListFilter(raw_data_orders,"completed").length,
          cancelled:make_ListFilter(raw_data_orders,"cancelled").length,
          pendingRevenue:sum_orders(make_ListFilter(raw_data_orders,"pending")),
          completedRevenue:sum_orders(make_ListFilter(raw_data_orders,"completed")),
          totalRevenue:sum_orders(raw_data_orders),
          recentOrders:recent_order_list
          
        }
      })
     })
     let q_customers=query(collection(db(),"Customers"),orderBy("updatedAt","desc"),limit(6)) // just give me the 6 news customers 
     var unsub_customers =onSnapshot(q_customers,(snap)=>{
     
      let raw_customers_data=snap.docs.map(customer=>{
          
          return( {id:customer.id,...customer.data()})as any
      })
      console.log(raw_customers_data)
      setStats(prev=>{
        return {
          ...prev,
          customerCount:raw_customers_data.length,
          recentCustomers:raw_customers_data
        }
      })
     })
     setLoading(false)

      
      
    return ()=>{
      unsub_orders();
      unsub_customers();
    }
    },[])

    


  return { stats, loading,listOrder }
}






//  // Real-time listener on orders — newest first, limited for recent list
//     const q = query(collection(db(), "orders"), orderBy("createdAt", "desc"), limit(100))
//     const unsub = onSnapshot(q, async (snap) => {
//       const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as RawOrder))
//        setOrders(orders)
//       const pending   = orders.filter(o => o.status === "pending")
//       const completed = orders.filter(o => o.status === "completed")
//       const cancelled = orders.filter(o => o.status === "cancelled")
      
//         const sum = (list: RawOrder[]) =>
//         list.reduce((acc, o) => acc + (o.total ?? 0), 0)

//       // Fetch customer count + recent customers with avatars
//       let customerCount = 0
//       let recentCustomers: RecentCustomer[] = []
//       try {
//         const [countSnap, customersSnap] = await Promise.all([
//           getCountFromServer(collection(db(), "Customers")),
//           getDocs(query(collection(db(), "Customers"), limit(5))),
//         ])
//         customerCount = countSnap.data().count

//         // For each customer, try to get their photoURL from the users collection
//         recentCustomers = await Promise.all(
//           customersSnap.docs.map(async (d) => {
//             const fullName: string = d.data().fullName ?? ""
//             let photoURL: string | null = null
//             try {
//               const userSnap = await getDoc(doc(db(), "users", d.id))
//               if (userSnap.exists()) photoURL = userSnap.data().photoURL ?? null
//             } catch { /* no avatar, use initial */ }
//             return { id: d.id, fullName, photoURL }
//           })
//         )
//       } catch {
//         // fall back to empty
//       }

//       // Build recent orders list (last 5 by array order — already DESC from onSnapshot)
//       // We'll show the first item name as a summary label
//       const recentOrders: RecentOrder[] = orders.slice(0, 5).map(o => {
//         const first = o.items?.[0]
//         const label = first
//           ? `${first.name} × ${first.qty}${o.items.length > 1 ? ` +${o.items.length - 1}` : ""}`
//           : "—"
//         return {
//           id: o.id,
//           customerName: "Order " + o.id.slice(-4), // Fallback label since names aren't in order docs
//           customerId: o.customerId,
//           firstItem: label,
//           total: o.total ?? 0,
//           status: o.status,
//         }
//       })