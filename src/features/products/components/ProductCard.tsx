import { calcDiscounted, formatPrice } from "../services/products.service"
import { type Product } from "../models/product.schema";
import { Link } from "react-router-dom"
import { useContext } from "react";
import { CartContext } from "@/features/cart/cart.reducer";

export function ProductCard({ product }: { product: Product }) {
  const { d, discounted } = calcDiscounted(product.price, product.discountPercent);
  const hasDiscount = d > 0;
  const ctx = useContext(CartContext);

  const available =
    typeof product.isAvailable === "boolean"
      ? product.isAvailable
      : typeof product.stock === "number"
      ? product.stock > 0
      : true;

  return (
    <article className="flex flex-col bg-white border border-[#E7DFD4] rounded-2xl overflow-hidden hover:border-[#A37A5B] transition-all duration-300">

      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative overflow-hidden bg-[#F7F3EC]">
        <div className="relative h-56 overflow-hidden">
          <img
            src={product?.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 bg-[#A37A5B] text-white rounded-full">
                Featured
              </span>
            )}
            {!available && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 bg-[#E7DFD4] text-[#9A948D] rounded-full">
                Sold Out
              </span>
            )}
          </div>

          {hasDiscount && (
            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 bg-[#A37A5B] text-white rounded-full">
              -{d}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Category */}
        {product.category && (
          <span className="text-[10px] tracking-widest uppercase text-[#A37A5B] font-medium">
            {product.category}
          </span>
        )}

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bebas text-xl tracking-wide text-[#2B2B2B] leading-tight hover:text-[#A37A5B] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          {hasDiscount ? (
            <>
              <span className="text-[#2B2B2B] font-semibold">{formatPrice(discounted)}</span>
              <span className="text-[#9A948D] text-xs line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-[#2B2B2B] font-semibold">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          disabled={!available}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            ctx?.dispatch({
              type: "ADD",
              payload: {
                productId: product.id,
                name: product.name,
                image: product.imageUrl,
                unitPrice: product.price,
                qty: 1,
                stock: product.stock,
              },
            });
          }}
          className={[
            "w-full py-2.5 rounded-full text-sm font-semibold tracking-wide transition",
            available
              ? "bg-[#A37A5B] text-white hover:bg-[#8a6449]"
              : "bg-[#F7F3EC] text-[#C4B8AD] cursor-not-allowed",
          ].join(" ")}
        >
          {available ? "Add to Cart" : "Sold Out"}
        </button>

      </div>
    </article>
  );
}
