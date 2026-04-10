import { CiSearch } from "react-icons/ci";
import { PiMoneyWavy } from "react-icons/pi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsBoxSeam } from "react-icons/bs";
import { TbUsers } from "react-icons/tb"
import SalesWidget from "../components/SalesWidget"
import { useDashboardStats } from "../hooks/useDashboardStats"
import { formatPrice } from "@/features/products/services/products.service"
import { Link } from "react-router-dom"

export function AdminDashboard() {
  const { stats, loading } = useDashboardStats()

  const statCards = [
    {
      label:   "New Orders",
      value:   loading ? "—" : String(stats.pending),
      sub:     loading ? "…" : formatPrice(stats.pendingRevenue),
      subLabel: "Pending value",
      bg:      "bg-[#D3F7ED]",
      iconBg:  "bg-[#1FD8A5]",
      icon:    <PiMoneyWavy />,
      color:   "text-[#1FD8A5]",
    },
    {
      label:   "Orders Completed",
      value:   loading ? "—" : String(stats.completed),
      sub:     loading ? "…" : formatPrice(stats.completedRevenue),
      subLabel: "Revenue earned",
      bg:      "bg-[#D0EBFF]",
      iconBg:  "bg-[#1599FA]",
      icon:    <LiaShippingFastSolid />,
      color:   "text-[#1599FA]",
    },
    {
      label:   "Total Orders",
      value:   loading ? "—" : String(stats.total),
      sub:     loading ? "…" : formatPrice(stats.totalRevenue),
      subLabel: "All-time revenue",
      bg:      "bg-[#FEEECD]",
      iconBg:  "bg-[#FFA60B]",
      icon:    <BsBoxSeam />,
      color:   "text-[#FFA60B]",
    },
  ]

  const shownCustomers = stats.recentCustomers.slice(0, 4)
  const customerOverflow = Math.max(0, stats.customerCount - shownCustomers.length)

  return (
    <div className="flex flex-col gap-6">

      {/* ── Top grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Track Order */}
        <div className="relative rounded-2xl overflow-hidden min-h-64 bg-[url('/TrackOrder.png')] bg-center bg-cover bg-no-repeat flex flex-col items-center justify-center p-6 gap-3">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 flex flex-col items-center gap-3 w-full">
            <h3 className="text-xl font-bold text-white">Track Order</h3>
            <p className="text-sm text-white/80 text-center">Type your order ID to find the order</p>
            <form className="w-full max-w-xs">
              <div className="border border-amber-200 flex items-center justify-between pl-4 pr-2 py-2 rounded-full bg-amber-50">
                <input
                  type="text"
                  placeholder="Order ID..."
                  className="outline-none text-sm w-full bg-transparent"
                />
                <button
                  type="submit"
                  className="text-lg cursor-pointer p-1.5 rounded-full bg-amber-400 text-white hover:bg-amber-600 transition"
                >
                  <CiSearch />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Stat cards */}
        <div className="md:col-span-2 grid grid-cols-1 gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {statCards.map(card => (
              <div key={card.label} className={`${card.bg} rounded-2xl p-5 flex items-center justify-between gap-3`}>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-700 truncate">{card.label}</p>
                  <p className={`text-3xl font-bold text-neutral-900 ${loading ? "animate-pulse" : ""}`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {card.subLabel}{" "}
                    <span className={`${card.color} font-semibold`}>{card.sub}</span>
                  </p>
                </div>
                <div className={`${card.iconBg} p-3 rounded-full text-white text-2xl shrink-0`}>
                  {card.icon}
                </div>
              </div>
            ))}

            {/* New Customers card */}
            <div className="bg-[#3F4F4F] rounded-2xl p-5 flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1 text-white min-w-0">
                <p className="text-sm font-medium">Customers</p>
                <p className={`text-3xl font-bold ${loading ? "animate-pulse" : ""}`}>
                  {loading ? "—" : stats.customerCount}
                </p>
                <p className="text-xs text-white/60">
                  Total registered
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex -space-x-3">
                  {shownCustomers.map((c) =>
                    c.photoURL ? (
                      <img
                        key={c.id}
                        src={c.photoURL}
                        alt={c.fullName}
                        className="h-8 w-8 rounded-full border-2 border-[#3F4F4F] object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        key={c.id}
                        className="h-8 w-8 rounded-full border-2 border-[#3F4F4F] bg-amber-700 text-white text-xs font-semibold flex items-center justify-center uppercase shrink-0"
                        title={c.fullName}
                      >
                        {c.fullName?.[0] ?? "?"}
                      </div>
                    )
                  )}
                  {loading && (
                    <div className="h-8 w-8 rounded-full border-2 border-[#3F4F4F] bg-[#3F4F4F] animate-pulse" />
                  )}
                </div>
                {customerOverflow > 0 && (
                  <span className="text-xs text-white/60">+{customerOverflow} more</span>
                )}
                <TbUsers className="text-white/40 text-lg" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Bottom grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Orders */}
        <div className="lg:col-span-1 rounded-2xl border border-[#E7DFD4] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#2B2B2B]">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-[#A37A5B] hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-[#F7F3EC] animate-pulse" />
              ))}
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <p className="text-sm text-[#9A948D] py-6 text-center">No orders yet</p>
          ) : (
            <div className="flex flex-col gap-0">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 py-2.5 border-b border-[#F0EAE3] last:border-0"
                >
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium text-[#2B2B2B] truncate font-mono">
                      #{order.id.slice(0, 7)}
                    </p>
                    <p className="text-xs text-[#9A948D] truncate">{order.firstItem}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className="text-sm font-semibold text-[#2B2B2B]">{formatPrice(order.total)}</p>
                    <span className={[
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      order.status === "pending"   ? "bg-amber-100 text-amber-700" :
                      order.status === "completed" ? "bg-green-100 text-green-700" :
                                                     "bg-red-100 text-red-600",
                    ].join(" ")}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sales Widget */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E7DFD4] bg-white p-5 overflow-hidden">
          <SalesWidget />
        </div>

      </div>
    </div>
  )
}
