import { User } from "@/types/api/user";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  role: string | null;
  token: string | null;
  setAuth: (user: User, role: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  token: null,
  setAuth: (user, role, token) => {
    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("userRole", role);
    localStorage.setItem("accessToken", token);
    set({ user, role, token });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("userRole");
    set({ user: null, role: null, token: null });
  },
}));
