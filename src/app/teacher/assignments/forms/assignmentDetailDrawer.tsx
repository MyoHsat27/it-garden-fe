import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Assignment } from "@/types/api/assignment";

interface AssignmentDetailDrawerProps {
  assignment: Assignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignmentDetailDrawer({
  assignment,
  open,
  onOpenChange,
}: AssignmentDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Assignment Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <strong>ID:</strong> {assignment.id}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(assignment.createdAt).toLocaleString()}
        </div>
      </div>
    </AppDrawer>
  );
}
