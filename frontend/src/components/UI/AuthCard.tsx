import { ReactNode } from "react";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-lg border bg-gray-700 p-6 shadow-sm">
      {children}
    </div>
  );
}
