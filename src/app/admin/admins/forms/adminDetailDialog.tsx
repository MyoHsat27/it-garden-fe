"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Admin } from "@/types/api/admin";

interface AdminDetailDialogProps {
  admin: Admin;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminDetailDialog({
  admin,
  open,
  onOpenChange,
}: AdminDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Detail</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-2">
          <div>
            <strong>ID:</strong> {admin.id}
          </div>
          <div>
            <strong>Name:</strong> {admin.fullName}
          </div>
          <div>
            <strong>Phone:</strong> {admin.phone}
          </div>
          <div>
            <strong>Role:</strong> {admin.role?.name}
          </div>
          <div>
            <strong>Created At:</strong>{" "}
            {new Date(admin.createdAt).toLocaleString()}
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end">
          <button
            className="btn btn-outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
