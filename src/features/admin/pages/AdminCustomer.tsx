import { useEffect, useState } from "react"
import { collection, getDocs, Timestamp } from "firebase/firestore"
import { db } from "@/app/firebase/firebase"
import { FiMapPin, FiPhone, FiUser } from "react-icons/fi"

type Customer = {
  id: string
  fullName: string
  phone?: string
  city?: string
  street?: string
  updatedAt?: Timestamp | null
}

function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDocs(collection(db(), "Customers"))
      .then((snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Customer))
        setCustomers(data)
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load customers"))
      .finally(() => setLoading(false))
  }, [])

  return { customers, loading, error }
}

function formatDate(ts?: Timestamp | null) {
  if (!ts) return "—"
  return ts.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function AdminCustomer() {
  const { customers, loading, error } = useCustomers()
  const [search, setSearch] = useState("")

  const filtered = customers.filter((c) =>
    c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  )

  if (error) return <p className="text-red-500 text-sm">{error}</p>
  if (loading) return <p className="text-[#9A948D] text-sm">Loading customers...</p>

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-[#9A948D]">
          {customers.length} customer{customers.length !== 1 ? "s" : ""}
        </p>
        <div className="relative w-full sm:w-64">
          <FiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A948D]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, city..."
            className="w-full pl-8 pr-3 py-2 rounded-full border border-[#E7DFD4] bg-white text-sm text-[#2B2B2B] placeholder-[#C4B8AD] outline-none focus:border-[#A37A5B] transition"
          />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-[#9A948D]">
          <p className="text-4xl">👤</p>
          <p className="text-sm">
            {search ? "No customers match your search" : "No customers yet"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#E7DFD4] bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#E7DFD4] bg-[#F7F3EC]">
                  {["#", "Customer", "Phone", "City", "Street", "Last Order"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-[#9A948D] uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE3]">
                {filtered.map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-[#FDFAF7] transition">

                    {/* # */}
                    <td className="px-4 py-3 text-xs text-[#9A948D]">{index + 1}</td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#A37A5B]/20 text-[#A37A5B] flex items-center justify-center font-semibold text-sm shrink-0">
                          {customer.fullName?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-[#2B2B2B]">{customer.fullName || "—"}</p>
                          <p className="text-xs text-[#9A948D] font-mono">{customer.id.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 whitespace-nowrap text-[#2B2B2B]">
                      {customer.phone || <span className="text-[#9A948D]">—</span>}
                    </td>

                    {/* City */}
                    <td className="px-4 py-3">
                      {customer.city ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                          <FiMapPin size={10} />
                          {customer.city}
                        </span>
                      ) : (
                        <span className="text-[#9A948D]">—</span>
                      )}
                    </td>

                    {/* Street */}
                    <td className="px-4 py-3 text-[#2B2B2B] max-w-40 truncate">
                      {customer.street || <span className="text-[#9A948D]">—</span>}
                    </td>

                    {/* Last Order */}
                    <td className="px-4 py-3 text-xs text-[#9A948D] whitespace-nowrap">
                      {formatDate(customer.updatedAt)}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {filtered.map((customer, index) => (
              <div
                key={customer.id}
                className="rounded-2xl border border-[#E7DFD4] bg-white p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#A37A5B]/20 text-[#A37A5B] flex items-center justify-center font-semibold text-base shrink-0">
                    {customer.fullName?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#2B2B2B] truncate">{customer.fullName || "—"}</p>
                    <p className="text-xs text-[#9A948D] font-mono">{customer.id.slice(0, 10)}…</p>
                  </div>
                  <span className="ml-auto text-xs text-[#9A948D]">#{index + 1}</span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {customer.phone && (
                    <span className="flex items-center gap-1 text-[#6E655E]">
                      <FiPhone size={11} /> {customer.phone}
                    </span>
                  )}
                  {customer.city && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <FiMapPin size={10} /> {customer.city}
                    </span>
                  )}
                  {customer.street && (
                    <span className="text-[#9A948D]">{customer.street}</span>
                  )}
                </div>

                <div className="text-xs text-[#9A948D] border-t border-[#F0EAE3] pt-2">
                  Last updated: {formatDate(customer.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminCustomer
