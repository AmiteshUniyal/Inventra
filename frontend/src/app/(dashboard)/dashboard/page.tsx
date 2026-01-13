"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useGetOverviewQuery } from "@/services/dashboardAPI";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Search, ArrowUpDown, AlertTriangle, ExternalLink } from "lucide-react";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"]; 

export default function DashboardPage() {
  const { data = { summary: { totalProducts: 0 }, departments: [] }, isLoading, isError } = useGetOverviewQuery(undefined);  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredDepartments = useMemo(() => {
    if (!data?.departments) return [];
    const filtered = data.departments.filter((dept) => 
      dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "outOfStock") {
      return [...filtered].sort((a, b) => b.stats.outOfStock - a.stats.outOfStock);
    }
    if (sortBy === "total") {
      return [...filtered].sort((a, b) => b.stats.totalProducts - a.stats.totalProducts);
    }
    return filtered;
  }, [data, searchTerm, sortBy]);

  if (isLoading) return <div className="flex items-center justify-center h-screen animate-pulse text-gray-400">Loading Warehouse Data...</div>;
  if (isError) return <div className="p-10 text-red-500 text-center">Failed to connect to server.</div>;

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="sticky top-8 z-20 bg-white/20 backdrop-blur-md border-b shadow-sm p-4 md:p-6 rounded-2xl">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-100 tracking-tight">Dashboard</h1>
              <p className="text-sm text-gray-200">Manage and monitor all store departments</p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-inner border border-gray-100">
               <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Total Stock</span>
                  <span className="text-xl font-black text-blue-600">{data.summary.totalProducts}</span>
               </div>
            </div>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white group-focus-within:text-blue-500 w-4 h-4 transition-colors" />
              <input
                type="text"
                placeholder="Search departments..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-400 border-none rounded-xl focus:bg-white focus:text-black focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all placeholder:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative min-w-[180px]">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4 pointer-events-none" />
              <select 
                className="w-full pl-10 pr-10 py-2.5 bg-gray-400 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="outOfStock">Sort by Alerts</option>
                <option value="total">Sort by Stock Size</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Departments */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDepartments.map((dept) => {
            const chartData = [
              { name: "In Stock", value: dept.stats.inStock },
              { name: "Low", value: dept.stats.lowStock },
              { name: "Out", value: dept.stats.outOfStock },
            ].filter(v => v.value > 0);

            return (
              <div key={dept.departmentId} className="group relative bg-gray-800 rounded-3xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col overflow-hidden">
                <Link href={`/dashboard/department/${dept.departmentId}`} className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="font-bold text-gray-00 group-hover:text-blue-600 transition-colors truncate">{dept.departmentName}</h2>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </div>

                  <div className="h-40 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={6}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none focus:outline-none" />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Warning Icon if Out of Stock */}
                    {dept.stats.outOfStock > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="bg-emerald-50 rounded-lg py-1.5">
                      <p className="text-[9px] uppercase font-black text-emerald-600 opacity-70">In</p>
                      <p className="text-xs font-bold text-emerald-700">{dept.stats.inStock}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg py-1.5">
                      <p className="text-[9px] uppercase font-black text-amber-600 opacity-70">Low</p>
                      <p className="text-xs font-bold text-amber-700">{dept.stats.lowStock}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg py-1.5">
                      <p className="text-[9px] uppercase font-black text-red-600 opacity-70">Out</p>
                      <p className="text-xs font-bold text-red-700">{dept.stats.outOfStock}</p>
                    </div>
                  </div>
                </Link>

                {/* Bottom Action Bar */}
                <Link 
                  href={`/dashboard/department/${dept.departmentId}`}
                  className="w-full py-3 bg-gray-50 group-hover:bg-blue-600 text-center text-xs font-bold text-gray-500 group-hover:text-white transition-all uppercase tracking-widest border-t"
                >
                  View Inventory Details
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}