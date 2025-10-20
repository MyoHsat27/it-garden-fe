"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  allowedRoles,
  children,
}: ProtectedRouteProps) => {
  const { role, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!role || !allowedRoles.includes(role)) {
      router.replace("/auth/login");
    }
  }, [role, allowedRoles, router, hydrated]);

  if (!hydrated || !role || !allowedRoles.includes(role)) return null;

  return <>{children}</>;
};
