"use client";

import Sidebar from "@/components/layout/SideBar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <AuthGuard>
        {/* Persistent Desktop Sidebar */}
        <Sidebar />
        
        {/* Content Area - Added ml-72 to account for fixed sidebar */}
        <div className="flex-1 flex flex-col md:ml-72">
          <MobileSidebar />
          <main className="flex-1 p-4 md:p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </main>
        </div>
      </AuthGuard>
    </div>
  );
}