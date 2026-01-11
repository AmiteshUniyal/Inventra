"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

type Props = {
  allowed: readonly("ADMIN" | "MANAGER" | "STAFF")[];
  children: React.ReactNode;
};

export default function RoleGuard({ allowed, children }: Props) {
  const role = useSelector(
    (state: RootState) => state.auth.user?.role
  );

  if (!role || !allowed.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
