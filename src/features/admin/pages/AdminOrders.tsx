import { useEffect, useState } from "react"
import { markOrdersAsSeen } from "../hooks/useNewOrdersCount"
import { useOrders, updateOrderStatus, type OrderStatus } from "../hooks/useOrders"
import { formatPrice } from "@/features/products/services/products.service"

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:   "bg-amber-100 text-amber-700 border border-amber-300",
  completed: "bg-green-100 text-green-700 border border-green-300",
  cancelled: "bg-red-100  text-red-700   border border-red-300",
}

type Filter = "all" | OrderStatus

export function AdminOrders() {
  const { orders, loading } = useOrders()
  const [filter, setFilter]     = useState<Filter>("all")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { markOrdersAsSeen() }, [])

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter)

  async function handleStatus(orderId: string, status: OrderStatus) {
    setUpdating(orderId)
    await updateOrderStatus(orderId, status)
    setUpdating(null)
  }

  function formatDate(ts: any) {
    if (!ts) return "—"
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#9A948D]">
            {filtered.length} order{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "completed", "cancelled"] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                "px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition",
                filter === f
                  ? "bg-[#A37A5B] text-white"
                  : "bg-white border border-[#E7DFD4] text-[#6E655E] hover:bg-[#F7F3EC]",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#9A948D] text-sm">
          Loading orders...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-[#9A948D]">
          <p className="text-4xl">📋</p>
          <p className="text-sm">No orders found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E7DFD4] bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#E7DFD4] bg-[#F7F3EC]">
                {["Order ID", "Customer", "Products", "Total", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-[#9A948D] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE3]">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-[#FDFAF7] transition">

                  {/* Order ID */}
                  <td className="px-4 py-3 font-mono text-xs text-[#A37A5B] font-semibold">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3 font-medium text-[#2B2B2B] whitespace-nowrap">
                    {order.customerName}
                  </td>

                  {/* Products */}
                  <td className="px-4 py-3 text-[#6E655E]">
                    <div className="flex flex-col gap-0.5">
                      {order.items.slice(0, 2).map(item => (
                        <span key={item.productId} className="text-xs">
                          {item.qty}× {item.name}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-xs text-[#9A948D]">
                          +{order.items.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 font-semibold text-[#2B2B2B] whitespace-nowrap">
                    {formatPrice(order.total)}
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-xs text-[#9A948D] whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <>
                          <button
                            disabled={updating === order.id}
                            onClick={() => handleStatus(order.id, "completed")}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 transition disabled:opacity-50"
                          >
                            Complete
                          </button>
                          <button
                            disabled={updating === order.id}
                            onClick={() => handleStatus(order.id, "cancelled")}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status !== "pending" && (
                        <span className="text-xs text-[#9A948D] italic">No action</span>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
