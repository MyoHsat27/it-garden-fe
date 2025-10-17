"use client";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DrawerProps {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function AppDrawer({
  open,
  title,
  onOpenChange,
  children,
  footer,
  size = "md",
}: DrawerProps) {
  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }[size];

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent
        className={`h-screen ${sizeClass} flex flex-col rounded-none`}
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>

        {/* Scrollable content */}
        <ScrollArea className="flex-1 overflow-y-auto mt-2">
          <div className="px-4">{children}</div>
        </ScrollArea>

        {footer && (
          <DrawerFooter className="mt-auto flex justify-end gap-2">
            {footer}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
