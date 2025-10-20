"use client";

import { ReactNode, useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Menu } from "@/components/common/Menu";
import Image from "next/image";
import { X } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-70 bg-white border-r border-gray-200 p-4 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:flex md:flex-col 
        `}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="items-center gap-2 mb-6 hidden md:flex w-auto">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="font-bold text-lg">IT Garden</span>
        </div>

        <Menu
          closeSidebar={() => setSidebarOpen(false)}
          defaultOpenGroups={["User Management"]}
        />
      </aside>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar openSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <ProtectedRoute allowedRoles={["teacher"]}>{children}</ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
