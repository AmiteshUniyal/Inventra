"use client";

import Link from "next/link";
import { useMeQuery } from "@/services/authAPI";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/UI/button";
import { Package, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { data, isLoading } = useMeQuery(undefined);

  useEffect(() => {
    if (data) {
      // Redirect to specific dashboard based on role/dept if needed
      const target = data.role === "ADMIN" ? "/dashboard" : `/dashboard/department/${data.departmentId}`;
      router.replace(target);
    }
  }, [data, router]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b border-white/5 backdrop-blur-md bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black uppercase tracking-tighter">Inventra</h1>
        </div>
        
        <div className="flex items-center gap-6">
           <Link href="/auth/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
             Login
           </Link>
           <Link href="/auth/create-store" className="hidden sm:block">
             <Button className="bg-white text-black hover:bg-gray-200 py-2 px-6 rounded-xl text-xs font-black uppercase tracking-widest">
               Get Started
             </Button>
           </Link>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 animate-fade-in">
            <Zap size={14} /> Powering Next-Gen Retail
          </div>
          
          <h2 className="text-4xl md:text-4xl font-black tracking-tight leading-[1.1] uppercase">
            Inventory management, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">done right.</span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Manage stores, departments, products, and staff with surgical precision. 
            The all-in-one glassmorphic engine for modern commerce.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/auth/create-store">
              <Button className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/30 flex items-center gap-3 active:scale-95 transition-all">
                Create Store
              </Button>
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left">
            <FeatureCard 
              icon={<Package className="text-blue-400" />} 
              title="Real-time Tracking" 
              desc="Instant stock status updates across all departments." 
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-400" />} 
              title="Role-Based Access" 
              desc="Strict permissions for Admins, Managers, and Staff." 
            />
            <FeatureCard 
              icon={<Zap className="text-amber-400" />} 
              title="Low Stock Alerts" 
              desc="Automated visual cues when your inventory hits critical levels." 
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} Inventra Engine • Advanced Logistics Control
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all group">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2 uppercase italic tracking-tight">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}