import { useContext, useMemo } from 'react'
import { CartContext } from '../cart.reducer'
import { Link } from "react-router-dom"
import { formatPrice } from "@/features/products/services/products.service"
import { MdDelete } from "react-icons/md"
import { TiShoppingCart } from 'react-icons/ti'

function CartDrawer() {
  const ctx = useContext(CartContext)
  const { totalQty, subtotal } = useMemo(() => {
    const totalQty = ctx?.state.cartlist.reduce((acc, it) => acc + it.qty, 0) ?? 0
    const subtotal = ctx?.state.cartlist.reduce((acc, it) => acc + it.unitPrice * it.qty, 0) ?? 0
    return { totalQty, subtotal }
  }, [ctx?.state.cartlist])

  const isEmpty = !ctx?.state.cartlist.length

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => ctx?.dispatch({ type: "TOGGLE_CART" })}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 z-60 bg-coffee-900 border-l border-coffee-700 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-coffee-700">
          <div className="flex items-center gap-2">
            <TiShoppingCart className="text-amber-500 text-2xl" />
            <h2 className="font-bebas text-xl tracking-wide text-white">Your Cart</h2>
          </div>
          <button
            onClick={() => ctx?.dispatch({ type: "TOGGLE_CART" })}
            className="text-white/50 hover:text-white text-2xl leading-none transition"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
              <TiShoppingCart className="text-coffee-600 text-6xl" />
              <p className="font-bebas text-2xl tracking-wide text-coffee-400">Your cart is empty</p>
              <p className="text-xs text-coffee-500">Add some coffee to get started</p>
              <Link
                to="/products"
                onClick={() => ctx?.dispatch({ type: "TOGGLE_CART" })}
                className="mt-2 px-6 py-2 border border-amber-700 text-amber-500 text-sm rounded-full hover:bg-amber-800/20 transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            ctx?.state.cartlist.map((item) => (
              <div
                key={item.productId}
                className="flex items-start gap-3 rounded-xl bg-coffee-800 border border-coffee-700 p-3"
              >
                {/* Image */}
                <div className="h-18 w-14 shrink-0 overflow-hidden rounded-lg bg-coffee-700">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 justify-between gap-3 min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-amber-500 font-medium">{formatPrice(item.unitPrice)}</p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => ctx?.dispatch({ type: "DEC", payload: { id: item.productId } })}
                      className="h-6 w-6 rounded-full bg-coffee-700 border border-coffee-600 text-white text-sm hover:bg-coffee-600 transition flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-white">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => ctx?.dispatch({ type: "INC", payload: { id: item.productId } })}
                      disabled={item.qty >= item.stock}
                      className="h-6 w-6 rounded-full bg-coffee-700 border border-coffee-600 text-white text-sm hover:bg-coffee-600 transition flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => ctx?.dispatch({ type: "REMOVE", payload: { id: item.productId } })}
                  className="text-lg text-coffee-500 hover:text-red-400 shrink-0 self-center transition"
                >
                  <MdDelete />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="px-5 py-4 border-t border-coffee-700 bg-coffee-900 flex flex-col gap-3">

            <div className="flex justify-between text-sm text-coffee-300">
              <span>Items</span>
              <span className="text-white font-semibold">{totalQty}</span>
            </div>

            <div className="flex justify-between text-sm text-coffee-300">
              <span>Subtotal</span>
              <span className="text-amber-400 font-semibold">{formatPrice(subtotal)}</span>
            </div>

            <Link
              to="/checkout"
              onClick={() => ctx?.dispatch({ type: "TOGGLE_CART" })}
              className="mt-1 block w-full text-center rounded-full px-4 py-3 text-sm font-semibold bg-amber-800 text-white hover:bg-amber-700 transition"
            >
              Checkout →
            </Link>

            <button
              onClick={() => ctx?.dispatch({ type: "TOGGLE_CART" })}
              className="block w-full text-center text-xs text-coffee-400 hover:text-white transition"
            >
              Continue Shopping
            </button>

          </div>
        )}

      </div>
    </>
  )
}

export default CartDrawer
