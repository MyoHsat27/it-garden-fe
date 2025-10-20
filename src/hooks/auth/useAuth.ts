"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { User } from "@/types/api/user";

export const useAuth = (options?: { redirectToLogin?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, role, logout } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedRole = localStorage.getItem("userRole");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedRole && storedUser) {
      useAuthStore.setState({
        token: storedToken,
        role: storedRole,
        user: JSON.parse(storedUser) as User,
      });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (pathname.startsWith("/auth")) return;

    if (!token) {
      if (options?.redirectToLogin !== false) router.push("/auth/login");
      return;
    }

    if (role && !pathname.startsWith(`/${role}`)) {
      router.push(`/${role}`);
    }
  }, [token, role, pathname, router]);

  return { token, user, role, logout, hydrated };
};
