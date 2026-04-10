import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useContext } from "react";
import { CartContext } from "@/features/cart/cart.reducer";
import CartDrawer from "@/features/cart/components/CartDrawer"

export function MainLayout() {
  const ctx = useContext(CartContext)
  return (
    <div className="min-h-screen flex flex-col  bg-coffee-950">
      <Header />
      {ctx?.state.isOpen && <CartDrawer />}
      <main className="flex-1 w-full max-w-350 mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
