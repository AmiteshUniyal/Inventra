"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useLazyMeQuery } from "@/services/authAPI";
import { setUser } from "@/store/authSlice";
import { RootState } from "@/store";
import Button from "@/components/UI/button";
import AuthCard from "@/components/UI/AuthCard";
import { Lock, Mail, Store, Loader2 } from "lucide-react";


export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const [storeCode, setStoreCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading: isLoginLoading, isError }] = useLoginMutation();
  
  const [triggerMe, { isFetching: isMeLoading }] = useLazyMeQuery();

  useEffect(() => {
  if (authUser && authUser.id) {
    if (authUser.role === "ADMIN") {
      router.push("/dashboard");
    } 
    else if (authUser.departmentId) {
      router.push(`/dashboard/department/${authUser.departmentId}`);
    }
    router.refresh();
  }
}, [authUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ storeCode, email, password }).unwrap();

      const userData = await triggerMe(undefined).unwrap();
      
      if (userData) {
        dispatch(setUser(userData));
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const isLoading = isLoginLoading || isMeLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1e293b] p-4">
      <AuthCard>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-400">
            Enter your credentials to access <span className="text-blue-400 font-semibold">Inventra</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="relative group">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 w-4 h-4 transition-colors" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
              placeholder="Store Code"
              value={storeCode}
              onChange={(e) => setStoreCode(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 w-4 h-4 transition-colors" />
            <input
              type="email"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
              placeholder="Email Address"
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
                Signing in...
              </>
            ) : "Login to Dashboard"}
          </Button>

          {isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg py-2 text-center">
              <p className="text-xs text-red-400 font-medium">Invalid credentials.</p>
            </div>
          )}
        </form>
      </AuthCard>
    </div>
  );
}