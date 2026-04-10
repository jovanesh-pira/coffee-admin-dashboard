import { useForm, FormProvider } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import useCreateProduct from "../hooks/useCreateProduct"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductInput } from "../models/product.schema"
import { InputComponent } from "@/shared/ui/Input"
import { FiArrowLeft } from "react-icons/fi"
import { useState } from "react"
const inputClass = "mt-1 w-full rounded-xl border border-[#E7DFD4] bg-white px-3 py-2.5 text-sm text-[#2B2B2B] placeholder-[#C4B8AD] outline-none focus:border-[#A37A5B] transition"

function ProductCreatePage() {
  
  const navigate = useNavigate()
  const methods = useForm({
    resolver: zodResolver(productSchema),
    mode: "all",
    defaultValues: {
      name:            "",
      category:        "",
      price:           0,
      stock:           0,
      description:     "",
      discountPercent: 0,
      featured:        false,
      isAvailable:     true,
      image:           null as any,
    },
  })

  const { create_product, error, loading, repsonse_product, setError } = useCreateProduct()

  const createSubmit = async (data: ProductInput) => {
    const res = await create_product(data)
    if (res) {
      methods.reset()
      navigate("/admin/products")
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      {/* Back */}
      <button
        onClick={() => navigate("/admin/products")}
        className="flex items-center gap-2 text-sm text-[#9A948D] hover:text-[#2B2B2B] transition w-fit"
      >
        <FiArrowLeft size={15} />
        Back to Products
      </button>

      {/* Alerts */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-start justify-between gap-3">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {repsonse_product?.id && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          ✅ Product created successfully!
        </div>
      )}

      {/* Form card */}
      <div className="rounded-2xl border border-[#E7DFD4] bg-white p-6 sm:p-8">

        <h2 className="font-bebas text-2xl tracking-wide text-[#2B2B2B] mb-1">New Product</h2>
        <p className="text-xs text-[#9A948D] mb-6">Fill in the details below to add a product to your catalog.</p>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(createSubmit)} className="space-y-5">

            {/* Name + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputComponent
                name="name"
                label="Product Name"
                placeholder="Latte, Cappuccino..."
                typeInput="text"
                extraClass={inputClass}
              />
              <InputComponent
                name="category"
                label="Category"
                placeholder="Coffee / Dessert / Beverage"
                typeInput="text"
                extraClass={inputClass}
              />
            </div>

            {/* Price + Stock + Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <InputComponent
                name="price"
                label="Price (KZT)"
                placeholder="e.g. 1590"
                typeInput="number"
                extraClass={inputClass}
              />
              <InputComponent
                name="stock"
                label="Stock"
                placeholder="e.g. 25"
                typeInput="number"
                extraClass={inputClass}
              />
              <InputComponent
                name="discountPercent"
                label="Discount (%)"
                placeholder="0 – 100"
                typeInput="number"
                extraClass={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-[#6E655E]">Description</label>
              <textarea
                {...methods.register("description")}
                placeholder="Short description of taste, ingredients, size..."
                className={`${inputClass} min-h-24 resize-none`}
              />
              {methods.formState.errors.description?.message && (
                <p className="mt-1 text-xs text-red-500">{String(methods.formState.errors.description.message)}</p>
              )}
            </div>

            {/* Flags */}
            <div className="rounded-xl border border-[#E7DFD4] bg-[#F7F3EC] p-4 flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-3 text-sm text-[#2B2B2B] cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-[#A37A5B]" {...methods.register("featured")} />
                Featured product
              </label>
              <label className="flex items-center gap-3 text-sm text-[#2B2B2B] cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-[#A37A5B]" {...methods.register("isAvailable")} />
                Available for sale
              </label>
            </div>

            {/* Image */}
            <div>
              <label className="text-sm text-[#6E655E]">Product Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm text-[#6E655E] rounded-xl border border-[#E7DFD4] bg-white px-3 py-2
                  file:mr-4 file:rounded-lg file:border-0 file:bg-[#A37A5B] file:px-4 file:py-1.5 file:text-white file:text-xs file:font-medium
                  hover:file:bg-[#8a6449] cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  console.log(file)
               
                  methods.setValue("image" as any, file, { shouldValidate: true })
                }}
              />
              {methods.formState.errors.image?.message && (
                <p className="mt-1 text-xs text-red-500">{String(methods.formState.errors.image.message)}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2 border-t border-[#E7DFD4]">
              <button
                type="button"
                disabled={loading}
                onClick={() => { methods.reset(); setError(null) }}
                className="px-4 py-2 rounded-full border border-[#E7DFD4] text-sm text-[#6E655E] hover:bg-[#F7F3EC] transition disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading || !methods.formState.isValid}
                className="px-6 py-2 rounded-full bg-[#A37A5B] text-white text-sm font-semibold hover:bg-[#8a6449] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
            </div>

          </form>
        </FormProvider>
          
      </div>

    </div>
  )
}

export default ProductCreatePage
