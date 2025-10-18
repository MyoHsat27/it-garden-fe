import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Enrollment } from "@/types/api/enrollment";

interface EnrollmentDetailDrawerProps {
  enrollment: Enrollment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrollmentDetailDrawer({
  enrollment,
  open,
  onOpenChange,
}: EnrollmentDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Enrollment Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <strong>ID:</strong> {enrollment.id}
        </div>
        <div>
          <strong>Enrolled At:</strong>{" "}
          {new Date(enrollment.createdAt).toLocaleString()}
        </div>
      </div>
    </AppDrawer>
  );
}
