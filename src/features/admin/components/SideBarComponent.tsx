import { MdDashboard } from "react-icons/md";
import { CiShoppingBasket, CiBoxes } from "react-icons/ci";
import { TbUsers, TbReportSearch } from "react-icons/tb";
import { FiArrowLeft } from "react-icons/fi";
import { NavLink, Link } from 'react-router-dom';
import { type NavItem } from "../models/admin.type";
import { useNewOrdersCount } from "../hooks/useNewOrdersCount";

type SideBarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

function SideBarComponent({ isOpen }: SideBarProps) {
  const newOrdersCount = useNewOrdersCount()

  const mainMenu: NavItem[] = [
    { label: "Dashboard", icon: <MdDashboard />,      to: "/admin"   },
    { label: "Products",  icon: <CiBoxes />,          to: "products" },
    { label: "Orders",    icon: <CiShoppingBasket />, to: "orders",  badge: newOrdersCount },
    { label: "Customers", icon: <TbUsers />,          to: "customer" },
    { label: "Reports",   icon: <TbReportSearch />,   to: "reports"  },
  ]

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        h-screen bg-[#F7F3EC] border-r border-[#E7DFD4]
        flex flex-col overflow-hidden
        transition-all duration-300
        ${isOpen ? "w-72 px-6 py-6" : "w-0 px-0 py-6"}
      `}
    >
      {/* Top */}
      <div className="flex items-center justify-between min-w-max">
        <div className="text-lg font-semibold tracking-tight text-[#2B2B2B]">
          Jovanesh <span className="font-normal text-[#A37A5B]">Coffee.</span>
        </div>
      </div>

      {/* Profile */}
      <div className="mt-8 flex flex-col items-center text-center min-w-max">
        <img
          src="https://plus.unsplash.com/premium_photo-1669703777437-27602d656c27?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="avatar"
          className="h-20 w-20 rounded-full object-cover border-4 border-[#F7F3EC] shadow-sm"
        />
        <div className="mt-4 text-base font-semibold text-[#2B2B2B]">Louis Carter</div>
        <div className="text-sm text-[#9A948D]">Administrator</div>
      </div>

      {/* Menu */}
      <div className="mt-8 min-w-max">
        <div className="text-xs font-semibold tracking-widest text-[#9A948D]">MAIN MENU</div>
        <nav className="mt-3 space-y-2">
          {mainMenu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                [
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition",
                  isActive
                    ? "bg-[#A37A5B] text-white shadow-sm"
                    : "text-[#6E655E] hover:bg-white/60",
                ].join(" ")
              }
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <span className="text-[#8E877F]">{item.icon}</span>
                {item.label}
              </span>
              {typeof item.badge === "number" && item.badge > 0 && (
                <span className="min-w-6 h-6 px-2 rounded-full bg-[#F5A524] text-white text-xs font-semibold grid place-items-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Back to Store */}
      <div className="mt-auto pt-6 min-w-max border-t border-[#E7DFD4]">
        <Link
          to="/products"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#6E655E] hover:bg-white/60 transition"
        >
          <FiArrowLeft size={16} />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}

export default SideBarComponent
