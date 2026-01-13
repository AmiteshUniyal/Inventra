"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearUser } from "@/store/authSlice";
import { useLogoutMutation } from "@/services/authAPI";
import RoleGuard from "@/components/RoleGuard";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Package, 
  ChevronRight, 
  LogOut, 
  AlertCircle,
  Loader2 
} from "lucide-react";
import { baseApi } from "@/services/baseAPI";

const itemBase = "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200";

interface SidebarContentProps {
  closeMobile?: () => void;
}

export default function SidebarContent({ closeMobile }: SidebarContentProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  // States
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const isActive = (path: string) =>
    pathname === path
      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
      : "text-gray-400 hover:bg-white/5 hover:text-white";

  const getHomePath = () => {
    if (user?.role === "ADMIN") return "/dashboard";
    if (user?.departmentId) return `/dashboard/department/${user.departmentId}`;
    return "/dashboard";
  };

  const handleLogout = async () => {
  try {
    // 1. Tell backend to clear the cookie
    await logoutApi(undefined).unwrap();
  } catch (error) {
    console.error("Backend logout failed:", error);
  } finally {
    // 2. Wipe Redux State
    dispatch(clearUser());
    
    // 3. Clear RTK-Query Cache (Crucial to prevent stale data flickering)
    dispatch(baseApi.util.resetApiState());

    // 4. Redirect and Refresh
    // Using window.location.href is often "safer" for logouts 
    // because it forces a hard reload, clearing all memory-leaked states
    window.location.href = "/"; 
  }
};

  const navItems = [
    { name: "Dashboard", href: getHomePath(), icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "STAFF"] as const },
    { name: "All Departments", href: "/departments", icon: Building2, roles: ["ADMIN"] as const },
    { name: "User Management", href: "/users", icon: Users, roles: ["ADMIN", "MANAGER"] as const },
    { name: "Products", href: "/products", icon: Package, roles: ["ADMIN", "MANAGER", "STAFF"] as const },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1e293b] border-r border-white/5 relative">
      {/* Header */}
      <div className="px-6 py-10 flex items-center">
        <span className="text-2xl font-black text-white tracking-tighter uppercase">
          Inventra
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((nav) => (
          <RoleGuard key={nav.href} allowed={nav.roles}>
            <Link
              href={nav.href}
              onClick={closeMobile}
              className={`${itemBase} ${isActive(nav.href)}`}
            >
              <nav.icon className={`w-5 h-5 ${pathname === nav.href ? "text-white" : "text-gray-500 group-hover:text-blue-400"}`} />
              <span className="flex-1">{nav.name}</span>
              {pathname === nav.href && <ChevronRight className="w-4 h-4 opacity-50" />}
            </Link>
          </RoleGuard>
        ))}
      </nav>


      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 shrink-0 uppercase">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm active:scale-95 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="bg-[#1e293b] border border-white/10 w-full max-w-sm rounded-[2rem] shadow-2xl p-8 animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                <AlertCircle size={32} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Confirm Logout</h2>
                <p className="text-gray-400 text-sm mt-1">Are you sure you want to end your current session?</p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full pt-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
                >
                  {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}