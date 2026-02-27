import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/context/useAuth";
import { FiUser, FiLogIn, FiUserPlus, FiAlertTriangle } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import { useContext, useReducer } from "react";
import { CartContext, CartReducer } from "@/features/cart/cart.reducer";
function getDisplayNameOrEmail(user: any) {
  return user?.displayName?.trim() || user?.email?.trim() || "User";
}
function getInitials(text: string) {
  const t = text.trim();
  if (!t) return "U";
  const parts = t.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "U";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm transition ${
          isActive ? "font-semibold" : "opacity-80 hover:opacity-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export  function Header() {
  const { user, loading, error } = useAuth();
  const display = user ? getDisplayNameOrEmail(user) : "";
  const initials = user ? getInitials(display) : "";
  const ctx=useContext(CartContext)
  

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold tracking-tight">
            Coffee Store
          </Link>

          <nav className="hidden sm:flex items-center gap-4">
            <NavItem to="/products" label="Products" />
            <NavItem to="/cart" label="Cart" />
            <NavItem to="/orders" label="Orders" />
            <NavItem to="/admin" label="Admin" />
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Error (subtle) */}
          {error && !loading && (
            <div
              className="hidden md:flex items-center gap-2 text-xs px-3 py-1 rounded-full border"
              role="alert"
              title={error}
            >
              <FiAlertTriangle className="opacity-80" />
              <span className="max-w-[220px] truncate">{error}</span>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
              <div className="hidden sm:block">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded mt-2 animate-pulse" />
              </div>
            </div>
          ) : user ? (
            /* Authenticated UI */
            <div className="flex items-center gap-2">
              {/* Avatar */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={display}
                  className="h-9 w-9 rounded-full object-cover border"
                />
              ) : (
                <div className="h-9 w-9 rounded-full border flex items-center justify-center text-xs font-semibold">
                  {initials || <FiUser />}
                </div>
              )}

              {/* Name/Email */}
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-sm font-medium max-w-[180px] truncate">
                  {user.displayName || "Account"}
                </span>
                <span className="text-xs opacity-70 max-w-[180px] truncate">
                  {user.email ?? "—"}
                </span>
              </div>

              {/* Optional: profile link / logout button later */}
              <Link
                to="/profile"
                className="hidden md:inline-flex text-sm px-3 py-2 rounded-lg border hover:bg-gray-50"
              >
                Profile
              </Link>
            </div>
          ) : (
            /* Guest UI */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border hover:bg-gray-50"
              >
                <FiLogIn />
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-black text-white hover:opacity-90"
              >
                <FiUserPlus />
                Register
              </Link>
            </div>
          )}
          <button className="text-2xl cursor-pointer relative" onClick={()=>ctx?.dispatch({type:"TOGGLE_CART"})}><TiShoppingCart/><span className="text-sm absolute -top-4 -right-4 bg-red-400 px-1.5 rounded-full">{ctx?.state.cartlist.length}</span></button>
        </div>
      </div>
    </header>
  );
}

