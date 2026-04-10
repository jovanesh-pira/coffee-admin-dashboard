import { CartContext, CartReducer } from "@/features/cart/cart.reducer"
import { useReducer, useEffect } from "react"
import { type CartState } from "@/features/cart/cart.reducer"

const CART_KEY = "jovanesh_cart"

function loadCart(): CartState {
  try {
    const saved = localStorage.getItem(CART_KEY)
    if (saved) return { cartlist: JSON.parse(saved), isOpen: false }
  } catch {
    // corrupted data — start fresh
  }
  return { cartlist: [], isOpen: false }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(CartReducer, undefined, loadCart)

  // sync cartlist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(state.cartlist))
  }, [state.cartlist])

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}
