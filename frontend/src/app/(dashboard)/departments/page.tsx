"use client";

import { useState } from "react";
import { 
  useGetDepartmentsQuery, 
  useCreateDepartmentMutation, 
  useUpdateDepartmentMutation, 
  useDeleteDepartmentMutation,
  Department,
  USER,
} from "@/services/departmentAPI";
import { useGetUsersQuery } from "@/services/userAPI"; 
import { LayoutGrid, Plus, Edit3, Trash2, X, User, Package, Fingerprint, Copy } from "lucide-react";

export default function DepartmentsPage() {
  const { data: depts, isLoading, isError } = useGetDepartmentsQuery(undefined);
  const { data: users } = useGetUsersQuery(undefined);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const [createDept] = useCreateDepartmentMutation();
  const [updateDept] = useUpdateDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();

  // Filter users to only show potential MANAGERS
  const potentialManagers = users?.filter((u: USER) => u.role === "MANAGER") || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      managerId: formData.get("managerId") as string,
    };

    try {
      if (selectedDept) {
        await updateDept({ id: selectedDept.id, ...payload }).unwrap();
      } else {
        await createDept(payload).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Operation failed", err);
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    // You could add a small toast notification here
  };

  if (isLoading) return <div className="p-10 text-white animate-pulse font-black text-center uppercase tracking-widest">Scanning Store Infrastructure...</div>;
  if (isError) return <div className="p-10 text-red-500 text-center font-bold">Error loading departments. Please check your connection.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 px-4">
      {/* Header */}
      <div className="sticky top-8 z-20 bg-white/10 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Departments</h1>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Global Store Organization</p>
        </div>
        <button 
          onClick={() => { setSelectedDept(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 font-black uppercase text-xs tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Create Department
        </button>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {depts?.map((dept: Department) => (
          <div key={dept.id} className="bg-[#333d4d] border border-white/5 p-8 rounded-[2.5rem] group hover:border-blue-500/30 transition-all relative overflow-hidden flex flex-col">
            
            {/* Action Buttons */}
            <div className="flex justify-between items-start mb-6">
              <div className="bg-blue-500/10 p-4 rounded-2xl">
                <LayoutGrid className="text-blue-400 w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setSelectedDept(dept); setIsModalOpen(true); }}
                  className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-all"
                  title="Edit Department"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { if(confirm('Delete department?')) deleteDept(dept.id); }}
                  className="p-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-colors"
                  title="Delete Department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title and ID */}
            <div className="mb-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter truncate">{dept.name}</h3>
              <div className="mt-2 flex items-center gap-2 group/id cursor-pointer" onClick={() => copyToClipboard(dept.id)}>
                <Fingerprint className="w-3 h-3 text-gray-500" />
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest truncate max-w-[150px]">
                  {dept.id}
                </span>
                <Copy className="w-3 h-3 text-gray-500 opacity-0 group-hover/id:opacity-100 transition-opacity" />
              </div>
            </div>
            
            {/* Stats/Relations */}
            <div className="space-y-4 mt-auto">
              <div className="flex items-center gap-3 text-gray-400 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                <User className="w-4 h-4 text-amber-500" />
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-black text-gray-500 tracking-widest">Manager</span>
                  <span className="font-bold text-gray-200">{dept.manager?.name || "Unassigned"}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-400 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                <Package className="w-4 h-4 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-black text-gray-500 tracking-widest">Inventory</span>
                  <span className="font-bold text-gray-200">{dept._count?.products || 0} Products</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Create/Update */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-200">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  {selectedDept ? "Update Department" : "New Department"}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"><X /></button>
              </div>

              {selectedDept && (
                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-[8px] font-black uppercase text-blue-500/70 tracking-widest">Department UUID</p>
                    <p className="text-[10px] font-mono text-gray-400">{selectedDept.id}</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Department Name</label>
                  <input 
                    name="name" 
                    defaultValue={selectedDept?.name} 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
                    placeholder="e.g. Warehouse A"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Assign Manager</label>
                  <div className="relative">
                    <select 
                      name="managerId" 
                      defaultValue={selectedDept?.managerId || ""}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#1e293b]">Choose a manager</option>
                      {potentialManagers.map((m: USER) => (
                        <option key={m.id} value={m.id} className="bg-[#1e293b] text-white">
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] tracking-widest text-xs">
                {selectedDept ? "Save Configuration" : "Initialize Department"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}