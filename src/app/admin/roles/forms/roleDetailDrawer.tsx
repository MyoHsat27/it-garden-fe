import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/api/role";

interface RoleDetailDrawerProps {
  role: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleDetailDrawer({
  role,
  open,
  onOpenChange,
}: RoleDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Role Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <strong>ID:</strong> {role.id}
        </div>
        <div>
          <strong>Name:</strong> {role.name}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(role.createdAt).toLocaleString()}
        </div>
      </div>
    </AppDrawer>
  );
}
