import { useEffect,useContext } from 'react'
import { useParams } from 'react-router-dom'
import useProductWithID from "@/features/products/hooks/useProductWithID"
import { calcDiscounted, formatPrice } from '../services/products.service'
import { CartContext } from '@/features/cart/cart.reducer'
export function ProductDetailsPage() {
  const param = useParams()
  const { get_Products_with_ID, loading, error, product } = useProductWithID()
  const ctx = useContext(CartContext)

  useEffect(() => {
    (async () => {
      if (!param.id) return
      await get_Products_with_ID(param.id)
    })()
  }, [param.id, get_Products_with_ID])

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-[#9A948D] text-sm">
      Loading...
    </div>
  )

  if (error) return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {error}
    </div>
  )

  if (!product) return (
    <div className="rounded-xl border border-[#E7DFD4] bg-white px-4 py-3 text-sm text-[#9A948D]">
      Product not found
    </div>
  )

  const { d, discounted } = calcDiscounted(product.price, product.discountPercent)
  const hasDiscount = d > 0
  const available = typeof product.isAvailable === 'boolean' ? product.isAvailable : (product.stock ?? 0) > 0

  function handleAddToCart() {
    // need make logic here so lets see what happen
    if(!product) return 
    ctx?.dispatch({type: 'ADD', payload: {productId: product.id, name: product.name, image: product.imageUrl, unitPrice: product.price, qty: 1, stock: product.stock}})
    console.log('Add to cart:', product)
  }

  return (
    <div className="rounded-2xl border border-[#E7DFD4] bg-white p-6 sm:p-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Left — Image */}
        <div className="relative w-full md:w-1/2 rounded-xl overflow-hidden bg-[#F7F3EC] flex items-center justify-center min-h-65">
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-[#A37A5B] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              -{d}% OFF
            </span>
          )}
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-120 object-cover"
            />
          ) : (
            <span className="text-[#9A948D] text-sm">No image</span>
          )}
        </div>

        {/* Right — Details */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">

          {/* Category */}
          {product.category && (
            <span className="text-xs uppercase tracking-widest text-[#A37A5B] font-medium">
              {product.category}
            </span>
          )}

          {/* Name */}
          <h1 className="font-bebas text-3xl sm:text-4xl text-[#2B2B2B] tracking-wide leading-tight">
            {product.name}
          </h1>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-[#9A948D] leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-2xl font-semibold text-[#2B2B2B]">
              {formatPrice(hasDiscount ? discounted : product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[#9A948D] line-through mb-0.5">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 text-xs text-[#9A948D]">
            <span className={`h-2 w-2 rounded-full ${available ? 'bg-emerald-500' : 'bg-red-400'}`} />
            {available ? 'In stock' : 'Out of stock'}
            {typeof product.stock === 'number' && (
              <span className="text-[#C4B8AD]">· {product.stock} left</span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!available}
            className="mt-auto w-full sm:w-auto px-6 py-3 rounded-full bg-[#A37A5B] text-white text-sm font-semibold hover:bg-[#8a6449] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>

        </div>
      </div>
    </div>
  )
}
