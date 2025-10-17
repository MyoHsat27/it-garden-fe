import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Admin } from "@/types/api/admin";

interface AdminDetailDrawerProps {
  admin: Admin;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminDetailDrawer({
  admin,
  open,
  onOpenChange,
}: AdminDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Admin Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
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
    </AppDrawer>
  );
}
