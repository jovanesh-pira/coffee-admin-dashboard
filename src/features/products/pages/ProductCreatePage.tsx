import {useForm,FormProvider} from "react-hook-form"
import useCreateProduct from "../Hooks/useCreateProduct"
import { zodResolver } from "@hookform/resolvers/zod"
import {productSchema,type ProductInput} from "../modles/product.schema"
import {InputComponent} from "@/shared/ui/Input"
function ProductCreatePage() {
   const methods=useForm({
    resolver:zodResolver(productSchema),
    mode:"all",
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
      discountPercent: 0,
      featured: false,
      isAvailable: true,
      image: null as any, 
    },
   })
   const {create_product,error,loading,repsonse_product,setError } = useCreateProduct()
   const createSubmit=async(data:ProductInput)=>{
    console.log(data)
    let res=await create_product(data)
    if(res){
        methods.reset()
    }
   }
  return (
     <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* subtle background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(212,165,116,0.25),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(92,64,51,0.25),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(2,136,209,0.12),transparent_40%)]" />

      <div className="relative max-w-5xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Create Product</h1>
          <p className="text-gray-400 mt-1">
            Add a new item to your coffee shop catalog (optional image upload, discounts, availability).
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur shadow-2xl">
          <div className="p-5 sm:p-8">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(createSubmit)} className="space-y-6">
                {/* Alerts */}
                {error && (
                  <div className="rounded-xl border border-red-900/40 bg-red-950/40 px-4 py-3 text-sm text-red-200 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">Create failed</div>
                      <div className="text-red-200/80 mt-1">{error}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="text-red-200/80 hover:text-red-200"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {repsonse_product?.id && (
                  <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
                    ✅ Product created. ID: <span className="font-mono">{repsonse_product.id}</span>
                  </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputComponent
                    name="name"
                    label="Product name"
                    placeholder="Latte, Cappuccino, Chocolate Cake..."
                    typeInput="text"
                    extraClass=""
                  />

                  <InputComponent
                    name="category"
                    label="Category"
                    placeholder="Coffee / Dessert / Beverage..."
                    typeInput="text"
                    extraClass=""
                  />

                  <InputComponent
                    name="price"
                    label="Price"
                    placeholder="e.g. 1590"
                    typeInput="number"
                    extraClass=""
                  />

                  <InputComponent
                    name="stock"
                    label="Stock"
                    placeholder="e.g. 25"
                    typeInput="number"
                    extraClass=""
                  />

                  <InputComponent
                    name="discountPercent"
                    label="Discount (%)"
                    placeholder="0 - 90"
                    typeInput="number"
                    extraClass=""
                  />

                  {/* اگر InputComponent checkbox ساپورت نمی‌کنه، برای featured/isAvailable ساده می‌سازیم */}
                  <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                    <div className="text-sm font-medium">Flags</div>
                    <div className="mt-3 space-y-3">
                      <label className="flex items-center gap-3 text-sm text-gray-200">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-amber-400"
                          {...methods.register("featured")}
                        />
                        Featured product
                      </label>

                      <label className="flex items-center gap-3 text-sm text-gray-200">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-amber-400"
                          {...methods.register("isAvailable")}
                        />
                        Available for sale
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full min-h-28 rounded-xl border border-gray-800 bg-gray-950/40 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/40"
                      placeholder="Short description of taste, ingredients, size..."
                      {...methods.register("description")}
                    />
                    {methods.formState.errors.description?.message && (
                      <p className="mt-2 text-xs text-red-300">
                        {String(methods.formState.errors.description.message)}
                      </p>
                    )}
                  </div>

                  {/* Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Product image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-300
                        file:mr-4 file:rounded-xl file:border-0
                        file:bg-amber-400/15 file:px-4 file:py-2 file:text-amber-200
                        hover:file:bg-amber-400/20
                        rounded-xl border border-gray-800 bg-gray-950/40 px-3 py-2"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        // اگر تو schema image: File | null داری:
                        methods.setValue("image" as any, file, { shouldValidate: true });
                      }}
                    />
                    {methods.formState.errors.image?.message && (
                      <p className="mt-2 text-xs text-red-300">
                        {String(methods.formState.errors.image.message)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end pt-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      methods.reset();
                      setError(null);
                    }}
                    className="rounded-xl border border-gray-800 bg-gray-950/40 px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-950/60 disabled:opacity-60"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !methods.formState.isValid}
                    className="rounded-xl bg-amber-400/20 border border-amber-400/30 px-5 py-2.5 text-sm font-medium text-amber-200
                      hover:bg-amber-400/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create product"}
                  </button>
                </div>

                {/* Small helper */}
                <div className="text-xs text-gray-500">
                  Tip: keep discountPercent at 0 if no discount. Image is optional.
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCreatePage
