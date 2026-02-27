import {calcDiscounted,formatPrice} from "../services/products.service"
import { type Product } from "../modles/product.schema";
import {Link} from "react-router-dom"
import { useContext } from "react";
import { CartContext } from "@/features/cart/cart.reducer";


export function ProductCard({ product }: { product: Product }) {
  const { d, discounted } = calcDiscounted(product.price, product.discountPercent);
  const hasDiscount = d > 0;
  let ctx =useContext(CartContext)
  const available =
    typeof product.isAvailable === "boolean"
      ? product.isAvailable
      : typeof product.stock === "number"
      ? product.stock > 0
      : true;

  return (
    <article className="group">
     <Link to={`/product/${product.id}`}>
      <div className="relative overflow-hidden rounded-none bg-neutral-100">
        {/* Badges */}
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          {product.featured && (
            <span className="border border-neutral-300 bg-white/80 px-2 py-1 text-[11px] uppercase tracking-widest text-neutral-800 backdrop-blur">
              Featured
            </span>
          )}
        </div>

        {hasDiscount && (
          <div className="absolute right-4 top-4 z-10">
            <span className="bg-neutral-900 px-2 py-1 text-[11px] font-medium tracking-wide text-white">
              -{d}% OFF
            </span>
          </div>
        )}

        <div className="">
          <img
            src={product?.imageUrl}
            alt={product.name}
            className="mx-auto h-80 w-full max-w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.08]"
            loading="lazy"
          />
        </div>
      </div>

      {/* Text area */}
      <div className="pt-8 text-center">
        <h3 className="font-serif text-2xl tracking-tight text-neutral-900">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center justify-center gap-3 text-neutral-800">
          {hasDiscount ? (
            <>
              <span className="text-lg">{formatPrice(discounted)}</span>
              <span className="text-sm text-neutral-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Optional meta row */}
        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-neutral-600">
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
              <span className="text-neutral-300">•</span>
              <span className="uppercase tracking-widest">{product.category}</span>
            </>
          ) : null}
        </div>

        
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            disabled={!available}
            onClick={(e)=>{
              e.preventDefault(); 
              e.stopPropagation();
              ctx?.dispatch({type:"ADD" ,payload:{productId:product.id,
                                                             name: product.name,
                                                             image:product.imageUrl,
                                                             unitPrice:product.price,
                                                             qty:1,stock:product.stock}})}}
            className={[
              "w-55 rounded-none border px-5 py-3 text-sm tracking-wide transition",
              available
                ? "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
                : "cursor-not-allowed border-neutral-300 bg-neutral-200 text-neutral-500",
            ].join(" ")}
          >
            Add to Cart
          </button>

        </div>
      </div>
      </Link>
    </article>
  );
}