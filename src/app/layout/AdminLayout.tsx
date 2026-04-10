
import { useState } from "react";
import {  Outlet,useMatches ,Link} from "react-router-dom";

import { PiBellLight } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import SideBarComponent from "@/features/admin/components/SideBarComponent";
type MatchHandle = {
  breadcrumb?: string;
  title?: string;
};

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const matches = useMatches();

  const breadcrumbItems = matches
    .filter((match) => (match.handle as MatchHandle)?.breadcrumb)
    .map((match) => ({
      pathname: match.pathname,
      breadcrumb: (match.handle as MatchHandle).breadcrumb!,
    }));
  const typedMatches = matches as Array<
    typeof matches[number] & {
      handle?: MatchHandle;
    }
  >;
  const currentTitle =
    [...typedMatches].reverse().find((match) => match.handle?.title)?.handle
      ?.title ?? "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBarComponent isOpen={sidebarOpen} onToggle={() => setSidebarOpen(p => !p)} />

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Hamburger — always visible */}
            <button
              onClick={() => setSidebarOpen(p => !p)}
              className="h-9 w-9 rounded-full border border-[#E7DFD4] bg-white grid place-items-center hover:bg-gray-50 transition"
            >
              <RxHamburgerMenu className="text-[#8E877F] text-[16px]" />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#2B2B2B]">
                {currentTitle}
              </h1>

              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 mt-1">
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1;
                  return (
                    <div key={item.pathname} className="flex items-center gap-2">
                      {isLast ? (
                        <span className="font-medium text-[#2B2B2B]">{item.breadcrumb}</span>
                      ) : (
                        <Link to={item.pathname} className="hover:text-[#2B2B2B]">{item.breadcrumb}</Link>
                      )}
                      {!isLast && <span>/</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative h-10 w-10 rounded-full bg-white border border-gray-200 grid place-items-center shadow-sm">
              <PiBellLight />
              <span className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0" />
            </div>
            <div className="relative h-10 w-10 rounded-full bg-white border border-gray-200 grid place-items-center shadow-sm">
              <CiMail />
              <span className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0" />
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
