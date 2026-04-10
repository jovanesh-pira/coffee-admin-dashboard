import { useState } from "react"
import { Link } from "react-router-dom"
import useProducts from "@/features/products/hooks/useProducts"
import {
  deleteProductService,
  toggleAvailabilityService,
  formatPrice,
  calcDiscounted,
} from "@/features/products/services/products.service"
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi"

type ConfirmTarget = { id: string; name: string; imageUrl?: string | null }

export function AdminProducts() {
  const { products, loading, error, refetch } = useProducts()
  const [deleting, setDeleting]= useState<string | null>(null)
  const [toggling, setToggling]= useState<string | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null)

  async function handleDelete() {
    if (!confirmTarget) return
    setDeleting(confirmTarget.id)
    setConfirmTarget(null)
    await deleteProductService(confirmTarget.id, confirmTarget.imageUrl)
    setDeleting(null)
    refetch()
  }

  async function handleToggle(id: string, current: boolean) {
    setToggling(id)
    await toggleAvailabilityService(id, !current)
    setToggling(null)
  }

  if (error)   return <p className="text-red-500 text-sm">{error}</p>
  if (loading) return <p className="text-[#9A948D] text-sm">Loading products...</p>

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#9A948D]">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A37A5B] text-white text-sm font-semibold hover:bg-[#8a6449] transition"
        >
          <FiPlus size={15} />
          Add Product
        </Link>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-[#9A948D]">
          <p className="text-4xl">📦</p>
          <p className="text-sm">No products yet</p>
          <Link to="/admin/products/new" className="text-[#A37A5B] text-sm underline">Add your first product</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E7DFD4] bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#E7DFD4] bg-[#F7F3EC]">
                {["#", "Product", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-[#9A948D] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE3]">
              {products.map((product, index) => {
                const { d, discounted } = calcDiscounted(product.price, product.discountPercent)
                const hasDiscount = d > 0

                return (
                  <tr key={product.id} className="hover:bg-[#FDFAF7] transition">

                    {/* # */}
                    <td className="px-4 py-3 text-xs text-[#9A948D]">{index + 1}</td>

                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#F7F3EC] shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xl">☕</div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#2B2B2B]">{product.name}</p>
                          <p className="text-xs text-[#9A948D]">{product.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {hasDiscount ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#2B2B2B]">{formatPrice(discounted)}</span>
                          <span className="text-xs text-[#9A948D] line-through">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-[#2B2B2B]">{formatPrice(product.price)}</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${product.stock === 0 ? "text-red-500" : product.stock < 10 ? "text-amber-500" : "text-green-600"}`}>
                        {product.stock}
                      </span>
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-3">
                      <button
                        disabled={toggling === product.id}
                        onClick={() => handleToggle(product.id, product.isAvailable)}
                        className={[
                          "px-2.5 py-1 rounded-full text-xs font-semibold border transition",
                          product.isAvailable
                            ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                            : "bg-red-100 text-red-600 border-red-300 hover:bg-red-200",
                          toggling === product.id ? "opacity-50 cursor-not-allowed" : "",
                        ].join(" ")}
                      >
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="h-8 w-8 rounded-lg border border-[#E7DFD4] bg-white grid place-items-center text-[#6E655E] hover:bg-[#F7F3EC] transition"
                          title="View"
                        >
                          <FiEdit2 size={13} />
                        </Link>
                        <button
                          disabled={deleting === product.id}
                          onClick={() => setConfirmTarget({ id: product.id, name: product.name, imageUrl: product.imageUrl })}
                          className="h-8 w-8 rounded-lg border border-red-200 bg-white grid place-items-center text-red-400 hover:bg-red-50 transition disabled:opacity-50"
                          title="Delete"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Delete confirmation modal */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-[#2B2B2B]">Delete product?</h3>
            <p className="text-sm text-[#6E655E]">
              Are you sure you want to delete <span className="font-semibold text-[#2B2B2B]">"{confirmTarget.name}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setConfirmTarget(null)}
                className="px-4 py-2 rounded-full border border-[#E7DFD4] text-sm text-[#6E655E] hover:bg-[#F7F3EC] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting === confirmTarget.id}
                className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleting === confirmTarget.id ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
