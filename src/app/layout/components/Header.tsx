import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { FiUser, FiLogIn, FiUserPlus, FiMenu, FiX } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import { useContext, useState } from "react";
import { CartContext } from "@/features/cart/cart.reducer";

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

const baseNav = "text-sm font-medium transition-all pb-1 border-b-2";
const activeNav = "text-amber-500 border-amber-500";
const inactiveNav = "text-white/70 border-transparent hover:text-white hover:border-white/30";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${baseNav} ${isActive ? activeNav : inactiveNav}`}
    >
      {label}
    </NavLink>
  );
}

function AnchorItem({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className={`${baseNav} ${inactiveNav}`}>
      {label}
    </a>
  );
}

export function Header() {
  const { user, loading } = useAuth();
  const display = user ? getDisplayNameOrEmail(user) : "";
  const initials = user ? getInitials(display) : "";
  const ctx = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = ctx?.state.cartlist.length ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-coffee-900/95 backdrop-blur-sm border-b border-coffee-800 mb-10">

      <div className="mx-auto max-w-350 px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/Logo.jpg"
            alt="Jovanesh Coffee"
            className="h-18 w-25 object-contain rounded-full"
          />
        
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavItem    to="/products"   label="Products"  />
          <AnchorItem href="/#feature" label="Features"  />
          <AnchorItem href="/#menu"    label="Menu"      />
          <AnchorItem href="/#about"   label="About Us"  />
          <AnchorItem href="/#contact" label="Contact"   />
          {user?.role === "admin" && (
            <NavItem to="/admin" label="Admin" />
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <button
            className="relative text-white/80 hover:text-white transition"
            onClick={() => ctx?.dispatch({ type: "TOGGLE_CART" })}
            aria-label="Open cart"
          >
            <TiShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-amber-600 text-white w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-coffee-700 animate-pulse" />
              <div className="hidden sm:block h-3 w-20 bg-coffee-700 rounded animate-pulse" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={display}
                  className="h-8 w-8 rounded-full object-cover border border-coffee-600"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-coffee-700 border border-coffee-600 text-white flex items-center justify-center text-xs font-semibold">
                  {initials || <FiUser />}
                </div>
              )}
              <span className="hidden sm:block text-sm text-white/80 max-w-32 truncate">
                {user.displayName || user.email}
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border border-coffee-600 text-white/80 hover:text-white hover:border-white/50 transition"
              >
                <FiLogIn size={14} />
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full bg-amber-700 text-white hover:bg-amber-600 transition"
              >
                <FiUserPlus size={14} />
                Register
              </Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden text-white/80 hover:text-white transition"
            onClick={() => setMobileMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4 border-t border-coffee-800 bg-coffee-900">
          {/* Route links */}
          {[
            { to: "/products", label: "Products" },
            { to: "/login",    label: "Login"     },
            { to: "/register", label: "Register"  },
            ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm py-2 px-3 rounded-lg transition ${
                  isActive
                    ? "bg-amber-700/20 text-amber-400 font-medium"
                    : "text-white/70 hover:bg-coffee-800 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {/* Anchor links */}
          {[
            { href: "/#feature", label: "Features" },
            { href: "/#menu",    label: "Menu"      },
            { href: "/#about",   label: "About Us"  },
            { href: "/#contact", label: "Contact"   },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm py-2 px-3 rounded-lg transition text-white/70 hover:bg-coffee-800 hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

    </header>
  );
}
