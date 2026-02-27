import React from "react";
import AuthProvider from "@/features/auth/context/AuthContext";
import {CartProvider} from "./CartProvider"
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>
    <CartProvider>
    {children}
    </CartProvider>
    </AuthProvider>;
}