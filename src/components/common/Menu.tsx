"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { menuItems, MenuItem } from "@/constants/menu-item";
import { useAuth } from "@/hooks/auth/useAuth";
import { usePathname } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

interface MenuProps {
  closeSidebar?: () => void;
  defaultOpenGroups?: string[];
}
export const Menu = ({ closeSidebar, defaultOpenGroups = [] }: MenuProps) => {
  const { role, user } = useAuth();

  const permissions = useMemo(() => {
    if (user?.adminProfile?.role?.permissions) {
      return user.adminProfile.role.permissions.map(
        (p) => `${p.subject}:${p.action}`
      );
    }
    return [];
  }, [user]);

  const pathname = usePathname();

  const { groups, groupNames } = useMemo(() => {
    if (!role) return { groups: {}, groupNames: [] };

    const filtered = menuItems.filter((item) => {
      const roleVisible = item.visible.includes(role);

      const hasPermission =
        !item.permission || permissions.includes(item.permission);

      return roleVisible && hasPermission;
    });

    const g: Record<string, MenuItem[]> = {};
    filtered.forEach((item) => {
      const group = item.group || "Other";
      if (!g[group]) g[group] = [];
      g[group].push(item);
    });
    return { groups: g, groupNames: Object.keys(g) };
  }, [role]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    groupNames.forEach((groupName) => {
      const groupItems = groups[groupName];
      const hasActiveItem = groupItems?.some((item) =>
        pathname.startsWith(item.href.replace("/admin", `/${role}`))
      );
      initialState[groupName] =
        defaultOpenGroups.includes(groupName) || hasActiveItem;
    });
    return initialState;
  });

  useEffect(() => {
    setOpenGroups((prev) => {
      const updated: Record<string, boolean> = { ...prev };
      groupNames.forEach((groupName) => {
        const groupItems = groups[groupName];
        const hasActiveItem = groupItems?.some((item) =>
          pathname.startsWith(item.href.replace("/admin", `/${role}`))
        );
        if (hasActiveItem) updated[groupName] = true;
      });
      return updated;
    });
  }, [pathname, role, groupNames, groups]);

  if (!role) return <nav />;

  return (
    <ScrollArea className="flex-1 overflow-x-hidden">
      <nav>
        {groupNames.map((groupName) => {
          const groupItems = groups[groupName];
          const isOpen = openGroups[groupName] ?? false;

          return (
            <div key={groupName} className="mb-2">
              <button
                className="w-full text-left px-3 py-1 text-xs font-semibold text-gray-500 uppercase hover:text-gray-700"
                onClick={() =>
                  setOpenGroups((prev) => ({ ...prev, [groupName]: !isOpen }))
                }
              >
                {groupName}
              </button>

              {isOpen && (
                <div className="flex flex-col gap-1 mt-1">
                  {groupItems.map((item) => {
                    const Icon = item.icon;
                    const itemHref = item.href.replace("/admin", `/${role}`);
                    const isActive = pathname === itemHref;

                    return (
                      <Link
                        key={item.label}
                        href={itemHref}
                        onClick={closeSidebar}
                        className={`flex items-center gap-2 w-auto md:w-full py-2 px-3 rounded-md ms-3 ${
                          isActive
                            ? "bg-lamaSkyLight text-primary"
                            : "text-gray-500 hover:text-primary "
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm md:text-md">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </ScrollArea>
  );
};
