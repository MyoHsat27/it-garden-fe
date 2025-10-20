// src/hooks/usePermission.ts
"use client";
import { useAuth } from "@/hooks/auth/useAuth";
import { canUserPerform } from "@/lib/utils";

export const usePermission = () => {
  const { user } = useAuth();

  const canPerform = (subject: string, action: string) =>
    canUserPerform(user, subject, action);

  return { canPerform };
};
