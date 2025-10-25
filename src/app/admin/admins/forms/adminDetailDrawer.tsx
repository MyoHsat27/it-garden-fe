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
      <div className="flex flex-col gap-6">
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Teacher Info</h3>
          <div className="grid grid-cols-2 gap-2 text-md">
            <div className="text-gray-500">Name</div>
            <div className="text-gray-900">{admin.fullName}</div>

            <div className="text-gray-500">Phone</div>
            <div className="text-gray-900">{admin.phone}</div>

            <div className="text-gray-500">Gender</div>
            <div className="text-gray-900">{admin.gender}</div>

            <div className="text-gray-500">Address</div>
            <div className="text-gray-900">{admin.address}</div>

            <div className="text-gray-500">Created At</div>
            <div className="text-gray-900">
              {new Date(admin.createdAt).toLocaleString()}
            </div>

            <div className="text-gray-500">Updated At</div>
            <div className="text-gray-900">
              {new Date(admin.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </AppDrawer>
  );
}
