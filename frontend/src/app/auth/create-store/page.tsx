"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateStoreMutation } from "@/services/authAPI";
import Button from "@/components/UI/button";
import AuthCard from "@/components/UI/AuthCard";
import { Lock, Mail, Store, User, Loader2, ArrowLeft } from "lucide-react";

export default function CreateStorePage() {
  const router = useRouter();

  const [storeName, setStoreName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [createStore, { isLoading, isError, error }] = useCreateStoreMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStore({
        storeName,
        name: adminName,
        email,
        password,
      }).unwrap();

      router.push("/auth/login");
    } 
    catch (err) {
      console.error("Store creation failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1e293b] p-4">
      <AuthCard>
        <div className="relative">
          <Link 
            href="/" 
            className="absolute -top-1 -left-1 p-2 text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Store</h1>
            <p className="mt-2 text-sm text-gray-400">
              Set up your <span className="text-blue-400 font-semibold">Inventra</span> workspace
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="relative group">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 w-4 h-4 transition-colors" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
              placeholder="Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 w-4 h-4 transition-colors" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
              placeholder="Admin Name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 w-4 h-4 transition-colors" />
            <input
              type="email"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
              placeholder="Admin Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 w-4 h-4 transition-colors" />
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating workspace...
              </>
            ) : "Initialize Store"}
          </Button>

          {isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg py-2 text-center">
              <p className="text-xs text-red-400 font-medium">
                {(error as any)?.data?.message || "Failed to create store."}
              </p>
            </div>
          )}

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have a workspace?{" "}
            <Link href="/auth/login" className="text-blue-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}