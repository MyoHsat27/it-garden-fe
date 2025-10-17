import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/api/student";

interface StudentDetailDrawerProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailDrawer({
  student,
  open,
  onOpenChange,
}: StudentDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="student Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <strong>ID:</strong> {student.id}
        </div>
        <div>
          <strong>Name:</strong> {student.fullName}
        </div>
        <div>
          <strong>Phone:</strong> {student.phone}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(student.createdAt).toLocaleString()}
        </div>
      </div>
    </AppDrawer>
  );
}
