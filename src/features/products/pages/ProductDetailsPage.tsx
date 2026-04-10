import { useEffect} from "react";
import { useParams } from "react-router-dom";
import useProductWithID from "../hooks/useProductWithID";
import {Link} from "react-router-dom"
import {calcDiscounted} from "../services/products.service"
import {formatPrice} from "../services/products.service"
export function ProductDetailsPage() {
  const param=useParams()
  
  
  let ProductID=(param.id ? param.id : "").trim()
  const {get_Products_with_ID,loading,error,product}=useProductWithID()
   useEffect(() => {
    if (!ProductID) return;
    (async () => {
      await get_Products_with_ID(ProductID);
    })();
  }, [ProductID, get_Products_with_ID]);
  
  
   
if (loading) {
  return (
    <div className="bg-white text-neutral-900">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          {/* Left skeleton image */}
          <div className="bg-neutral-100 p-4 sm:p-6 lg:p-10">
            <div className="h-[280px] w-full rounded-none bg-neutral-200 animate-pulse sm:h-[360px] lg:h-[420px]" />
          </div>

          {/* Right skeleton details */}
          <div className="pt-0 sm:pt-2">
            <div className="h-9 w-2/3 bg-neutral-200 animate-pulse" />
            <div className="mt-4 flex items-center gap-3">
              <div className="h-7 w-32 bg-neutral-200 animate-pulse" />
              <div className="h-5 w-20 bg-neutral-200 animate-pulse" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-4 w-full bg-neutral-200 animate-pulse" />
              <div className="h-4 w-11/12 bg-neutral-200 animate-pulse" />
              <div className="h-4 w-8/12 bg-neutral-200 animate-pulse" />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-4 w-28 bg-neutral-200 animate-pulse" />
              <div className="h-4 w-24 bg-neutral-200 animate-pulse" />
            </div>

            <div className="mt-8 space-y-5">
              {/* Select skeletons */}
              <div>
                <div className="h-3 w-16 bg-neutral-200 animate-pulse" />
                <div className="mt-2 h-10 w-full bg-neutral-200 animate-pulse" />
              </div>

              <div>
                <div className="h-3 w-16 bg-neutral-200 animate-pulse" />
                <div className="mt-2 h-10 w-full bg-neutral-200 animate-pulse" />
              </div>

              <div>
                <div className="h-3 w-16 bg-neutral-200 animate-pulse" />
                <div className="mt-2 h-10 w-full bg-neutral-200 animate-pulse" />
              </div>

              {/* Qty + button skeleton */}
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <div className="h-10 w-[132px] bg-neutral-200 animate-pulse" />
                <div className="h-10 w-full bg-neutral-200 animate-pulse sm:w-[180px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Optional: related skeleton */}
        <div className="mt-12 border-t border-neutral-200 pt-10">
          <div className="mx-auto h-4 w-40 bg-neutral-200 animate-pulse" />
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="group block">
                <div className="bg-neutral-100 p-6">
                  <div className="h-40 w-full bg-neutral-200 animate-pulse" />
                </div>
                <div className="pt-4 text-center">
                  <div className="mx-auto h-5 w-32 bg-neutral-200 animate-pulse" />
                  <div className="mx-auto mt-2 h-4 w-24 bg-neutral-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

 
if (!ProductID || error) {
  return (
    <div className="bg-white text-neutral-900">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mx-auto max-w-xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 place-items-center border border-red-200 bg-red-50 text-red-600">
              !
            </div>

            <div className="flex-1">
              <h2 className="font-serif text-2xl tracking-tight">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {error ?? "Invalid product id."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex h-10 items-center justify-center border border-neutral-300 bg-white px-4 text-sm tracking-wide hover:bg-neutral-50"
                >
                  Back to products
                </Link>

                <button
                  onClick={() => ProductID && get_Products_with_ID(ProductID)}
                  className="inline-flex h-10 items-center justify-center bg-neutral-900 px-5 text-sm font-medium uppercase tracking-widest text-white hover:bg-neutral-800"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

  
if (!product) {
  return (
    <div className="bg-white text-neutral-900">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mx-auto max-w-xl border border-neutral-200 bg-white p-6 sm:p-8">
          <h2 className="font-serif text-2xl tracking-tight">
            Product not found
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            The product data is empty.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex h-10 items-center justify-center border border-neutral-300 bg-white px-4 text-sm tracking-wide hover:bg-neutral-50"
          >
            Back to products
          </Link>
        </div>
      </section>
    </div>
  );
}
const { d, discounted } = calcDiscounted(product.price, product.discountPercent);
  const hasDiscount = d > 0;
  const available =
    typeof product.isAvailable === "boolean"
      ? product.isAvailable
      : typeof product.stock === "number"
      ? product.stock > 0
      : true;

 return (
    <div className="bg-white text-neutral-900">
      {/* Top Section */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          {/* Left: Image */}
          <div className="bg-neutral-100 p-4 sm:p-6 lg:p-10">
            <div className="relative">
              {product.discountPercent && (
                <span className="absolute right-0 top-0 bg-neutral-900 px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-white sm:px-3 sm:py-2 sm:text-xs">
                  -{product.discountPercent}% OFF
                </span>
              )}
              <img
                src={product?.imageUrl}
                alt={product.name}
                className="mx-auto h-[260px] w-full object-contain sm:h-[320px] md:h-[380px] lg:h-[420px]"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="pt-0 sm:pt-2">
            <h1 className="font-serif text-2xl tracking-tight sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
              <span className="text-2xl font-semibold">
                {formatPrice(hasDiscount ? discounted : product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-neutral-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Short description */}
            {product.description ? (
              <p className="mt-4 max-w-prose text-sm leading-6 text-neutral-700 sm:text-base">
                {product.description}
              </p>
            ) : null}

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-neutral-600">
              <span className="flex items-center gap-2">
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    available ? "bg-emerald-500" : "bg-red-500",
                  ].join(" ")}
                />
                {available ? "Available" : "Unavailable"}
              </span>
              {product.category ? (
                <>
                  <span className="text-neutral-300">|</span>
                  <span className="uppercase tracking-widest">{product.category}</span>
                </>
              ) : null}
              
            </div>

           <button
            type="button"
            disabled={!available}
            className={[
              "mt-10 w-full rounded-none border px-5 py-3 text-sm tracking-wide transition sm:mt-12 sm:w-auto sm:min-w-[220px]",
              available
                ? "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
                : "cursor-not-allowed border-neutral-300 bg-neutral-200 text-neutral-500",
            ].join(" ")}
          >
            Add to Cart
          </button>
          </div>
        </div>
        
      </section>

      {/* Optional: Related products */}
     
    </div>
  );
}
