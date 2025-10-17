"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  open: boolean;
  confirmText?: string;
  confirmButtonVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmationDialog({
  title,
  description,
  open,
  confirmText,
  confirmButtonVariant,
  onOpenChange,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <p className="mt-2">{description}</p>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant={"outline"} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={confirmButtonVariant ?? "default"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText ?? "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
