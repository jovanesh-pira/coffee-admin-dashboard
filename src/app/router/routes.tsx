import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/app/router/ProtectedRoute"
// layouts (from app/layout)
import { MainLayout } from "@/app/layout/MainLayout";
import { AuthLayout } from "@/app/layout/AuthLayout";
import { AdminLayout } from "@/app/layout/AdminLayout";

// pages
import { HomePage } from "@/app/pages/HomePage";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { ProductDetailsPage } from "@/features/products/pages/ProductDetailsPage";
import { CartPage } from "@/features/cart/pages/CartPage";
import { OrdersPage } from "@/features/orders/pages/OrdersPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { AdminDashboard } from "@/features/admin/pages/AdminDashboard";
import { AdminProducts } from "@/features/admin/pages/AdminProducts";
import { AdminOrders } from "@/features/admin/pages/AdminOrders";
import { NotFoundPage } from "@/app/pages/NotFoundPage";
import ProductCreatePage from "@/features/products/pages/ProductCreatePage"
import CheckoutPage from "@/features/cart/pages/CheckoutPage"

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "product/:id", element: <ProductDetailsPage /> },
      { path: "cart", element: <CartPage /> },
      {path:"newproduct", element:<ProductCreatePage/>}
    ],
  },

  // ✅ Protected customer/user routes
  {
    element: <ProtectedRoute requiredRole={["customer","admin"]} />,
    children: [
      
      { path: "/checkout", element: <CheckoutPage /> }, // absolute ok, or "orders" if inside "/"
    ],
  },

  // ✅ Protected admin routes
  {
    element: <ProtectedRoute requiredRole={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "products", element: <AdminProducts /> },
          { path: "orders", element: <AdminOrders /> },
        ],
      },
    ],
  },

  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [{ index: true, element: <RegisterPage /> }],
  },

  { path: "*", element: <NotFoundPage /> },
]);
