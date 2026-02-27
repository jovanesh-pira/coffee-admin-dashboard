import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useContext } from "react";
import { CartContext } from "@/features/cart/cart.reducer";
import CartDrawer from "@/features/cart/components/CartDrawer"
export function MainLayout() {
  const ctx=useContext(CartContext)
  return (
    <div className="min-h-screen flex flex-col">
     <Header/>
     {ctx?.state.isOpen && <CartDrawer/>}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>

     <Footer/>
    </div>
  );
}
