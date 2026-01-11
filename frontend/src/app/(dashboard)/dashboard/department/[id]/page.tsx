"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetDepartmentDashboardQuery } from "@/services/dashboardAPI";
import { ArrowLeft, Package, AlertCircle, CheckCircle2, BarChart3, Loader2 } from "lucide-react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function DepartmentDashboard() {
  const { id } = useParams();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [isAuthorized, setIsAuthorized] = useState(false);

  const { data, isLoading, isError } = useGetDepartmentDashboardQuery(id as string, {
    skip: !isAuthorized,
  });

  useEffect(() => {
    if (user) {
      if (user.role !== "ADMIN" && user.departmentId !== id) {
        router.replace(`/dashboard/department/${user.departmentId}`);

      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, id, router]);

  if (!isAuthorized || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#1e293b] text-gray-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="animate-pulse font-medium">Loading Department Data...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#1e293b] p-10">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Access Error</h2>
          <p className="text-gray-400 mt-2">Failed to load department dashboard</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: "In Stock", value: data.inStock },
    { name: "Low Stock", value: data.lowStock || 0 },
    { name: "Out of Stock", value: data.outOfStock },
  ].filter(v => v.value > 0);

  return (
    <div className="min-h-screen space-y-8 pb-10 bg-[#1e293b]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#333d4d]/50 backdrop-blur-md border-b border-white/5 p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-white border border-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {data.departmentName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Live Inventory analysis</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              <div className="text-right">
                <p className="text-[10px] uppercase font-black text-gray-500 leading-none mb-1">Total Capacity</p>
                <p className="text-3xl font-black text-blue-400 leading-none">{data.totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500/50" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Items" 
            value={data.totalProducts} 
            icon={<Package className="text-blue-400" />} 
            subtitle="Registered SKU's"
          />
          <StatCard 
            title="Healthy Stock" 
            value={data.inStock} 
            icon={<CheckCircle2 className="text-emerald-400" />} 
            subtitle="Above threshold"
          />
          <StatCard 
            title="Critical Stock" 
            value={data.outOfStock} 
            icon={<AlertCircle className="text-red-400" />} 
            subtitle="Immediate action req."
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          <div className="lg:col-span-3 bg-[#333d4d] rounded-[2rem] p-8 border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Stock Distribution</h2>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px'}}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#333d4d] rounded-[2rem] p-8 border border-white/5 shadow-2xl flex flex-col">
            <h2 className="text-xl font-bold text-white mb-8">Quick Status</h2>
            <div className="space-y-4 flex-1">
              <StatusRow label="Optimized" value={data.inStock} color="text-emerald-400" bg="bg-emerald-400/5" />
              <StatusRow label="Attention" value={data.lowStock || 0} color="text-amber-400" bg="bg-amber-400/5" />
              <StatusRow label="Urgent" value={data.outOfStock} color="text-red-400" bg="bg-red-400/5" />
            </div>
            <button className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 active:scale-95">
              Download Dept. Report
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, subtitle }: any) {
  return (
    <div className="bg-[#333d4d] p-7 rounded-[2rem] border border-white/5 shadow-lg group hover:bg-[#3d4858] transition-all cursor-default">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
          <p className="text-4xl font-black text-white mt-2 tracking-tight">{value}</p>
          <p className="text-[10px] text-gray-400 mt-1 font-medium italic">{subtitle}</p>
        </div>
        <div className="p-4 bg-[#1e293b] rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, value, color, bg }: any) {
  return (
    <div className={`flex items-center justify-between p-5 rounded-2xl border border-white/5 ${bg} transition-hover hover:border-white/10`}>
      <span className={`font-bold tracking-tight ${color}`}>{label}</span>
      <span className="text-2xl font-black text-white">{value}</span>
    </div>
  );
}