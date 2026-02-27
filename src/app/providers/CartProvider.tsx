import {CartContext} from "@/features/cart/cart.reducer"
import {CartReducer} from "@/features/cart/cart.reducer"
import { useReducer } from "react"
import {type CartState} from "@/features/cart/cart.reducer"
export const initialCartState: CartState = {
  cartlist: [],
  isOpen:false
};

export function CartProvider({children}:{children:React.ReactNode}){
  const [state, dispatch] = useReducer(CartReducer, initialCartState);
    return <CartContext.Provider value={
        {state, dispatch}
    }>{
        children
    }</CartContext.Provider>

}



