"use client";

import { useState } from "react";
import SidebarContent from "./SidebarContent";
import { Menu, X } from "lucide-react";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-[#1e293b]/80 backdrop-blur-md px-6 py-4">
        <span className="text-xl font-black text-white tracking-tighter uppercase">Inventra</span>
        <button 
          onClick={() => setOpen(true)} 
          className="p-2 bg-white/5 rounded-xl text-gray-300 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-[70vw] sm:w-80 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button 
          onClick={() => setOpen(false)}
          className="absolute right-4 top-10 z-10 p-2 text-gray-500 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <SidebarContent closeMobile={() => setOpen(false)} />
      </aside>
    </>
  );
}