import { User } from "@/types/api/user";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const canUserPerform = (
  user: User | null,
  subject: string,
  action: string
) => {
  if (!user) return false;
  if (user.userRole !== "admin") return true;

  const permissions = user.adminProfile?.role?.permissions || [];
  return permissions.some(
    (p: { subject: string; action: string }) =>
      p.subject === subject && p.action === action
  );
};
