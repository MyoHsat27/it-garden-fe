"use client";

import {
  Bell,
  Menu as MenuIcon,
  ChevronDown,
  User,
  LogOut,
  MessageCircle,
} from "lucide-react";
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
import { UserRole } from "@/types/api/user";

interface NavbarProps {
  openSidebar: () => void;
}

export function Navbar({ openSidebar }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  let fullName = "";
  if (user) {
    fullName = user.username;
    if (user.userRole === UserRole.ADMIN)
      fullName = user.adminProfile?.fullName ?? user.username;
    else if (user.userRole === UserRole.STUDENT)
      fullName = user.studentProfile?.fullName ?? user.username;
    else if (user.userRole === UserRole.TEACHER)
      fullName = user.teacherProfile?.fullName ?? user.username;
  }

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={openSidebar}
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      <div className="flex-1"></div>

      <div className="flex items-center gap-5">
        <div className="relative flex gap-3">
          <button className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <Bell className="w-5 h-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center"
            >
              3
            </Badge>
          </button>
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            onClick={() => router.push("/chats")}
          >
            <MessageCircle className="w-5 h-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center"
            >
              3
            </Badge>
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{fullName[0]}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium">
              {fullName}
            </span>
            <ChevronDown className="hidden sm:block w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
