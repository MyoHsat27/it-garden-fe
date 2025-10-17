"use client";

import { Bell, Menu as MenuIcon, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

interface NavbarProps {
  openSidebar: () => void;
}

export function Navbar({ openSidebar }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      {/* MOBILE HAMBURGER */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={openSidebar}
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* EMPTY SPACER */}
      <div className="flex-1"></div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center"
            >
              3
            </Badge>
          </button>
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium">
              {user?.username}
            </span>
            <ChevronDown className="hidden sm:block w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
