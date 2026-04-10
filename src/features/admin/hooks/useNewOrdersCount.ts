import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore"
import { db } from "@/app/firebase/firebase"

const STORAGE_KEY = "jovanesh_orders_last_seen"
const SEEN_EVENT  = "jovanesh:orders-seen"

function getLastSeen(): Timestamp {
  const str = localStorage.getItem(STORAGE_KEY)
  return str
    ? Timestamp.fromDate(new Date(str))
    : Timestamp.fromDate(new Date(0)) // first visit → all orders are "new"
}

// Call this when admin opens the Orders page
export function markOrdersAsSeen() {
  localStorage.setItem(STORAGE_KEY, new Date().toISOString())
  window.dispatchEvent(new Event(SEEN_EVENT))
}

// Returns live count of orders created after last visit to Orders page
export function useNewOrdersCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let unsub: (() => void) | undefined

    function subscribe() {
      unsub?.() // tear down previous listener
      const q = query(
        collection(db(), "orders"),
        where("createdAt", ">", getLastSeen())
      )
      unsub = onSnapshot(q, (snap) => setCount(snap.size))
    }

    subscribe() // initial subscribe

    // Re-subscribe with updated timestamp when Orders page is visited
    window.addEventListener(SEEN_EVENT, subscribe)

    return () => {
      unsub?.()
      window.removeEventListener(SEEN_EVENT, subscribe)
    }
  }, [])

  return count
}
