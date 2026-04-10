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
    <article className="group flex flex-col bg-coffee-800 border border-coffee-700 rounded-2xl overflow-hidden hover:border-amber-700/50 transition-all duration-300">

      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative overflow-hidden">
        <div className="relative h-56 bg-coffee-700 overflow-hidden">
          <img
            src={product?.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 bg-amber-700 text-white rounded-sm">
                Featured
              </span>
            )}
            {!available && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 bg-coffee-900/80 text-coffee-300 rounded-sm">
                Sold Out
              </span>
            )}
          </div>

          {hasDiscount && (
            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 bg-red-600 text-white rounded-sm">
              -{d}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Category */}
        {product.category && (
          <span className="text-[10px] tracking-[0.2em] uppercase text-amber-600 font-medium">
            {product.category}
          </span>
        )}

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bebas text-xl tracking-wide text-white leading-tight group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          {hasDiscount ? (
            <>
              <span className="text-amber-400 font-semibold">{formatPrice(discounted)}</span>
              <span className="text-coffee-400 text-xs line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-amber-400 font-semibold">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Add to cart */}
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
              ? "bg-amber-800 text-white hover:bg-amber-700"
              : "bg-coffee-700 text-coffee-500 cursor-not-allowed",
          ].join(" ")}
        >
          {available ? "Add to Cart" : "Sold Out"}
        </button>

      </div>
    </article>
  );
}
