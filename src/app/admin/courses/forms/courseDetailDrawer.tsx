import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/api/course";

interface CourseDetailDrawerProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailDrawer({
  course,
  open,
  onOpenChange,
}: CourseDetailDrawerProps) {
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
          <strong>ID:</strong> {course.id}
        </div>
        <div>
          <strong>Name:</strong> {course.name}
        </div>
        <div>
          <strong>Price:</strong> {course.price} MMK
        </div>
        <div>
          <strong>Description:</strong> {course.description}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(course.createdAt).toLocaleString()}
        </div>
      </div>
    </AppDrawer>
  );
}
