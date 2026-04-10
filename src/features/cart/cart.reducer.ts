// reducer and Context

import { createContext } from "react";
export type CartContextValue = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
};
export const CartContext=createContext<CartContextValue | null>(null)
export type Cart={
  productId: string;
  name: string;
  image?: string;
  unitPrice: number;
  qty: number;
  stock:number
//   options?: CartOptions;
}
export type CartState={
    cartlist:Cart[],
    isOpen:boolean
}
type CartAction=
{type:"ADD",payload:Cart} | {type:"REMOVE" ,payload:{id:string}} | {type:"CLEAR"} | {type:"TOGGLE_CART"} | {type:"INC" ,payload:{id:string}}|{type:"DEC",payload:{id:string}}
export function CartReducer(state:CartState,action:CartAction):CartState{
    switch(action.type){
         case "ADD": {
      const incomingQty = action.payload.qty ?? 1;
      const idx = state.cartlist.findIndex(i => i.productId === action.payload.productId);
      if (action.payload.stock <= 0) return state;

      if (idx === -1) {
        return {
          ...state,
          cartlist: [
            ...state.cartlist,
            {
              ...action.payload,
              qty: Math.min(incomingQty, action.payload.stock),
            },
          ],
        };
      }

    
      return {
        ...state,
        cartlist: state.cartlist.map((item, i) => {
          if (i !== idx) return item;
          const next = Math.min(item.qty + incomingQty, item.stock);
          return { ...item, qty: next };
        }),
      };
    }

    case "INC": {
      return {
        ...state,
        cartlist: state.cartlist.map(item => {
          if (item.productId !== action.payload.id) return item;
          if (item.qty >= item.stock) return item; // ✅ سقف
          return { ...item, qty: item.qty + 1 };
        }),
      };
    }

    case "DEC": {
      return {
        ...state,
        cartlist: state.cartlist
          .map(item => {
            if (item.productId !== action.payload.id) return item;
            return { ...item, qty: item.qty - 1 };
          })
          .filter(item => item.qty > 0), // qty صفر شد حذف
      };
    }
    case "REMOVE": {
      return {
        ...state,
        cartlist: state.cartlist.filter(item => item.productId !== action.payload.id),
      };
    }

    case "CLEAR": {
      return { ...state, cartlist: [] };
    }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    default: return state;
}}