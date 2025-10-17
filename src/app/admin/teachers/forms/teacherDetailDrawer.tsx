import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/api/teacher";

interface TeacherDetailDrawerProps {
  teacher: Teacher;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeacherDetailDrawer({
  teacher,
  open,
  onOpenChange,
}: TeacherDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Teacher Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <strong>ID:</strong> {teacher.id}
        </div>
        <div>
          <strong>Name:</strong> {teacher.fullName}
        </div>
        <div>
          <strong>Phone:</strong> {teacher.phone}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(teacher.createdAt).toLocaleString()}
        </div>
      </div>
    </AppDrawer>
  );
}
