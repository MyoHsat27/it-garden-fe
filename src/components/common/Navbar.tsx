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
import { useNotifications } from "@/hooks/useNotification";
import { useState } from "react";
import { Notification } from "@/types/api/notification";

interface NavbarProps {
  openSidebar: () => void;
}

export function Navbar({ openSidebar }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead } = useNotifications(
    user?.id ?? 0
  );
  const [showPopup, setShowPopup] = useState(false);
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
        <div className="relative">
          <button
            onClick={() => setShowPopup((s) => !s)}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center"
              >
                {unreadCount}
              </Badge>
            )}
          </button>

          {showPopup && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
              <div className="px-3 py-2 font-semibold border-b">
                Notifications
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="p-3 text-sm text-gray-500">
                    No notifications yet.
                  </p>
                )}
                {notifications.map((n: Notification) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b hover:bg-gray-50 ${
                      !n.read ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-gray-500 mb-1">{n.body}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                    {!n.read && (
                      <button
                        className="text-xs text-blue-600 mt-1"
                        onClick={() => markAsRead(n.id)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
