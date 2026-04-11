import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import getProductWithID from "@/features/products/hooks/useProductWithID"
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, type ProductInput } from '../models/product.schema'
import { updateProductService } from '../services/products.service'
import { FiArrowLeft } from 'react-icons/fi'

const inputClass = "mt-1 w-full rounded-xl border border-[#E7DFD4] bg-white px-3 py-2.5 text-sm text-[#2B2B2B] placeholder-[#C4B8AD] outline-none focus:border-[#A37A5B] transition"
const labelClass = "text-sm text-[#6E655E]"
const errorClass = "mt-1 text-xs text-red-500"

function ProductEditPage() {
  const Methods = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    mode: "all"
  })
  const param = useParams()
  const ID = param.id
  const navigate = useNavigate()
  const { get_Products_with_ID, loading, error, product } = getProductWithID()

  useEffect(() => {
    if (!ID) return
    ;(async () => { await get_Products_with_ID(ID) })()
  }, [ID])

  useEffect(() => {
    if (!product) return
    Methods.reset({
      name:            product.name,
      category:        product.category,
      price:           product.price,
      stock:           product.stock,
      description:     product.description ?? "",
      discountPercent: product.discountPercent ?? 0,
      featured:        product.featured,
      isAvailable:     product.isAvailable,
      image:           undefined,
    })
  }, [product])

  if (loading) return (
    <div className="flex items-center gap-3 text-sm text-[#9A948D] py-10">
      <div className="h-4 w-4 rounded-full border-2 border-[#A37A5B] border-t-transparent animate-spin" />
      Loading product...
    </div>
  )

  if (error) return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 max-w-md">
      {error}
    </div>
  )

  const onSubmitEvent = async (data: ProductInput) => {
    if (!ID) return
    await updateProductService(ID, data, product?.imageUrl)
    navigate("/admin/products")
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">

      <button
        onClick={() => navigate("/admin/products")}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E7DFD4] bg-white text-sm text-[#2B2B2B] font-medium hover:bg-[#F7F3EC] transition w-fit"
      >
        <FiArrowLeft size={15} />
        Back to Products
      </button>

      <div className="rounded-2xl border border-[#E7DFD4] bg-white p-6 sm:p-8">
        <h2 className="font-bebas text-2xl tracking-wide text-[#2B2B2B] mb-1">Edit Product</h2>
        <p className="text-xs text-[#9A948D] mb-6">Update the product details below.</p>

        <form onSubmit={Methods.handleSubmit(onSubmitEvent)} className="space-y-5">

          {/* Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Product Name</label>
              <input {...Methods.register("name")} type="text" placeholder="Latte, Cappuccino..." className={inputClass} />
              {Methods.formState.errors.name && <p className={errorClass}>{Methods.formState.errors.name.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input {...Methods.register("category")} type="text" placeholder="Coffee / Dessert / Beverage" className={inputClass} />
              {Methods.formState.errors.category && <p className={errorClass}>{Methods.formState.errors.category.message}</p>}
            </div>
          </div>

          {/* Price + Stock + Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Price (KZT)</label>
              <input {...Methods.register("price")} type="number" placeholder="e.g. 1590" className={inputClass} />
              {Methods.formState.errors.price && <p className={errorClass}>{Methods.formState.errors.price.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input {...Methods.register("stock")} type="number" placeholder="e.g. 25" className={inputClass} />
              {Methods.formState.errors.stock && <p className={errorClass}>{Methods.formState.errors.stock.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Discount (%)</label>
              <input {...Methods.register("discountPercent")} type="number" placeholder="0 – 100" className={inputClass} />
              {Methods.formState.errors.discountPercent && <p className={errorClass}>{Methods.formState.errors.discountPercent.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              {...Methods.register("description")}
              placeholder="Short description..."
              className={`${inputClass} min-h-24 resize-none`}
            />
            {Methods.formState.errors.description && <p className={errorClass}>{Methods.formState.errors.description.message}</p>}
          </div>

          {/* Flags */}
          <div className="rounded-xl border border-[#E7DFD4] bg-[#F7F3EC] p-4 flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-3 text-sm text-[#2B2B2B] cursor-pointer">
              <input type="checkbox" className="h-4 w-4 accent-[#A37A5B]" {...Methods.register("featured")} />
              Featured product
            </label>
            <label className="flex items-center gap-3 text-sm text-[#2B2B2B] cursor-pointer">
              <input type="checkbox" className="h-4 w-4 accent-[#A37A5B]" {...Methods.register("isAvailable")} />
              Available for sale
            </label>
          </div>

          {/* Image */}
          <div>
            <label className={labelClass}>Product Image</label>
            {product?.imageUrl && (
              <img src={product.imageUrl} alt="Current" className="mt-2 h-24 w-24 rounded-xl object-cover border border-[#E7DFD4]" />
            )}
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm text-[#6E655E] rounded-xl border border-[#E7DFD4] bg-white px-3 py-2
                file:mr-4 file:rounded-lg file:border-0 file:bg-[#A37A5B] file:px-4 file:py-1.5 file:text-white file:text-xs file:font-medium
                hover:file:bg-[#8a6449] cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                Methods.setValue("image" as any, file, { shouldValidate: true })
              }}
            />
            <p className="mt-1 text-xs text-[#9A948D]">Leave empty to keep current image</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2 border-t border-[#E7DFD4]">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 rounded-full border border-[#E7DFD4] text-sm text-[#6E655E] hover:bg-[#F7F3EC] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!Methods.formState.isValid}
              className="px-6 py-2 rounded-full bg-[#A37A5B] text-white text-sm font-semibold hover:bg-[#8a6449] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ProductEditPage
