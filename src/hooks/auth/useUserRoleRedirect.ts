"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export const useUserRoleRedirect = () => {
  const router = useRouter();
  const { role } = useAuthStore();

  useEffect(() => {
    if (role) router.push(`/${role}`);
  }, [role, router]);
};
