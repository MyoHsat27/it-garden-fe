import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { StudentAssignment } from "@/types/api/assignment";
import Link from "next/link";

interface AssignmentDetailDrawerProps {
  assignment: StudentAssignment;
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
        {assignment.media && (
          <div>
            <a download target="_blank" href={assignment.media.url}>
              Attachment
            </a>{" "}
            {assignment.id}
          </div>
        )}
        <div>
          <strong>Due Date:</strong>{" "}
          {new Date(assignment.dueDate).toDateString()}
        </div>
      </div>
    </AppDrawer>
  );
}
