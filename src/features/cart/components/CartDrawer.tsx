
import  { useContext, useMemo } from 'react'
import { CartContext } from '../cart.reducer'
import{Link} from "react-router-dom"
import {formatPrice} from "@/features/products/services/products.service"
import { MdDelete } from "react-icons/md";

function CartDrawer() {
    let ctx =useContext(CartContext)
    const { totalQty, subtotal } = useMemo(() => {
    const totalQty = ctx?.state.cartlist.reduce((acc, it) => acc + it.qty, 0);
    const subtotal = ctx?.state.cartlist.reduce((acc, it) => acc + it.unitPrice * it.qty, 0);
    return { totalQty, subtotal };
  }, [ctx?.state.cartlist]);
  return (
   <div className="fixed right-0 top-0 bottom-0 w-[380px] z-20 bg-white shadow-xl border-l border-neutral-200 p-4">
      <h2 className="text-lg font-semibold text-neutral-900">Your Cart</h2>

      {ctx?.state.cartlist.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">Cart is empty</p>
      ) : (
        <div className="mt-4 space-y-4">
          {ctx?.state.cartlist.map((item) => (
            <div
              key={item.productId}
              className="flex items-start gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5"
            >
              {/* image */}
              <div className="h-30 w-20 overflow-hidden rounded-xl bg-neutral-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
           {/* second col */}
            <div className='flex flex-col flex-1 min-h-25  justify-between gap-6'>
                {/* details */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-neutral-900">
                  {item.name}
                </p>
                <p className="mt-4 text-[16px] text-neutral-500 ">

                  {formatPrice(item.unitPrice)}
                </p>
              </div>

              {/* qty controls */}
              <div className="flex items-center gap-2 ">
                <button
                  type="button"
                  onClick={() =>
                    ctx?.dispatch({ type: "DEC", payload: { id: item.productId } })
                  }
                  className="h-5 w-5  bg-white text-neutral-800 hover:bg-neutral-50"
                >
                  −
                </button>

                <span className="w-5 text-center text-sm font-semibold text-neutral-900">
                  {item.qty}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    ctx?.dispatch({ type: "INC", payload: { id: item.productId } })
                  }
                  className="h-5 w-5  bg-white text-neutral-800 hover:bg-neutral-50"
                >
                  +
                </button>
              </div>
            </div>
              <button className='text-xl text-red-500 ml-auto self-center'><MdDelete/></button>
            </div>
          ))}
          <div className="mt-4 border-t border-neutral-200 pt-4">
        <div className="flex items-center justify-between text-sm text-neutral-700">
          <span>Items</span>
          <span className="font-semibold text-neutral-900">{totalQty}</span>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-neutral-700">
          <span>Total</span>
          <span className="font-semibold text-neutral-900">
           
            {subtotal && formatPrice(subtotal)}
          </span>
        </div>

        <Link
          to="/checkout"
          className={[
            "mt-4 block w-full text-center rounded-xl px-4 py-3 text-sm font-semibold transition",
            ctx?.state.cartlist.length && ctx?.state.cartlist.length > 0
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "pointer-events-none bg-neutral-200 text-neutral-500",
          ].join(" ")}
        >
          Checkout
        </Link>
      </div>
        </div>
       
      )}
    </div>
  )
}

export default CartDrawer
