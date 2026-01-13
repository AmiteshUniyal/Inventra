"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  useGetUsersQuery,
  useGetDepartmentUsersQuery,
  useDeleteUserMutation,
  useCreateUsersMutation,
  useUpdateUserMutation,
  User,
  GroupedUsers,
} from "@/services/userAPI";
import RoleGuard from "@/components/RoleGuard";
import {
  UserPlus, Mail, Trash2, Edit, Building2, Crown, X
} from "lucide-react";

export default function UsersPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // API Hooks
  const adminQuery = useGetUsersQuery(undefined, { skip: !isAdmin });
  const managerQuery = useGetDepartmentUsersQuery(undefined, { skip: isAdmin });
  const { data: users, isLoading } = isAdmin ? adminQuery : managerQuery;
  
  const [deleteUser] = useDeleteUserMutation();
  const [createUser] = useCreateUsersMutation();
  const [updateUser] = useUpdateUserMutation();

  if (isLoading) return <div className="flex items-center justify-center h-screen animate-pulse text-gray-400 font-black uppercase tracking-widest">Loading...</div>;

  const groupUsersByDepartment = (): GroupedUsers => {
    if (!users) return {};
    return users.reduce((acc: GroupedUsers, curr: User) => {
      
      if (curr.role === "ADMIN") return acc;
      
      const deptName = curr.department?.name || "Unassigned Sector";
      
      if (!acc[deptName]) {
        acc[deptName] = [];
      }
      acc[deptName].push(curr);
      
      return acc;
    }, {});
  };

  const departments = groupUsersByDepartment();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id, ...data }).unwrap();
      } else {
        await createUser(data).unwrap();
      }
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error("Failed to save user", err);
    }
  };

  return (
    <div className="relative min-h-screen pb-12 space-y-8">
      {/* Header */}
      <div className="sticky top-8 z-20 bg-white/10 backdrop-blur-xl border-b border-white/5 shadow-2xl p-4 md:p-6 rounded-3xl mx-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Personnel Directory</h1>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">Role: {user?.role}</p>
          </div>

          <RoleGuard allowed={["ADMIN"]}>
            <button 
              onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 text-xs uppercase tracking-widest"
            >
              <UserPlus className="w-5 h-5" /> Provision User
            </button>
          </RoleGuard>
        </div>
      </div>

      {/* Department Blocks */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-16">
        {Object.keys(departments).map((deptName) => {
          const deptUsers = departments[deptName];
          const manager = deptUsers.find((u) => u.role === "MANAGER");
          const staffMembers = deptUsers.filter((u) => u.role === "STAFF");

          return (
            <section key={deptName} className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <div className="h-[2px] w-8 bg-blue-600"></div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-blue-500" /> {deptName}
                </h2>
              </div>

              <div className="flex flex-wrap gap-6">
                {/* Manager Card */}
                {manager && (
                  <div className="w-full lg:w-[380px] bg-gradient-to-br from-amber-500/20 to-gray-900 border-2 border-amber-500/30 rounded-[2.5rem] p-8 relative">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-gray-900 shadow-lg"><Crown className="w-8 h-8" /></div>
                      <RoleGuard allowed={["ADMIN"]}>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingUser(manager); setIsModalOpen(true); }} className="p-3 bg-white/5 hover:bg-amber-500 hover:text-gray-900 rounded-xl transition-all"><Edit className="w-5 h-5" /></button>
                          <button onClick={() => deleteUser(manager.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </RoleGuard>
                    </div>
                    <h3 className="text-2xl font-black text-white">{manager.name}</h3>
                    <p className="text-gray-400 text-sm mt-2"><Mail className="w-4 h-4 inline mr-1" /> {manager.email}</p>
                  </div>
                )}

                {/* Staff Cards */}
                <div className="flex-1 flex flex-wrap gap-4">
                  {staffMembers.map((s) => (
                    <div key={s.id} className="min-w-[280px] flex-1 bg-gray-900/50 border border-white/5 rounded-[2rem] p-6 group hover:border-blue-500/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">{s.name.charAt(0)}</div>
                        <RoleGuard allowed={["ADMIN"]}>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditingUser(s); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => deleteUser(s.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </RoleGuard>
                      </div>
                      <h4 className="text-white font-bold text-lg">{s.name}</h4>
                      <p className="text-gray-500 text-xs mb-4"><Mail className="w-3 h-3 inline mr-1" /> {s.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  {editingUser ? "Update User Profile" : "Provision New User"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-400"><X /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input name="name" defaultValue={editingUser?.name} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all" placeholder="e.g. John Doe" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input name="email" type="email" defaultValue={editingUser?.email} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all" placeholder="john@example.com" />
                </div>

                {!editingUser && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Initial Password</label>
                    <input name="password" type="password" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all" placeholder="••••••••" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">System Role</label>
                    <select name="role" defaultValue={editingUser?.role || "STAFF"} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all appearance-none">
                      <option value="STAFF" className="bg-gray-900">STAFF</option>
                      <option value="MANAGER" className="bg-gray-900">MANAGER</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Department</label>
                    <input name="departmentId" defaultValue={editingUser?.departmentId} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all" placeholder="Paste Dept UUID" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] mt-4">
                  {editingUser ? "Apply Changes" : "Confirm Provisioning"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}