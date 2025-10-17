import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Classroom } from "@/types/api/classroom";

interface ClassroomDetailDrawerProps {
  classroom: Classroom;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassroomDetailDrawer({
  classroom,
  open,
  onOpenChange,
}: ClassroomDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Course Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <strong>ID:</strong> {classroom.id}
        </div>
        <div>
          <strong>Name:</strong> {classroom.name}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(classroom.createdAt).toLocaleString()}
        </div>
      </div>
    </AppDrawer>
  );
}
