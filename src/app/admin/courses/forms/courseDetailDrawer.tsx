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
      <div className="flex flex-col gap-6">
        {/* Course Info Card */}
        <div className="border rounded-lg p-4 shadow-sm bg-white text-md">
          <h3 className="text-lg font-semibold mb-2">Course Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">ID</div>
            <div className="text-gray-900">{course.id}</div>

            <div className="text-gray-500">Name</div>
            <div className="text-gray-900">{course.name}</div>

            <div className="text-gray-500">Price</div>
            <div className="text-gray-900">{course.price} MMK</div>

            <div className="text-gray-500">Duration</div>
            <div className="text-gray-900">{course.duration}</div>

            <div className="text-gray-500">Description</div>
            <div className="text-gray-900">{course.description}</div>

            <div className="text-gray-500">Created At</div>
            <div className="text-gray-900">
              {new Date(course.createdAt).toLocaleString()}
            </div>

            <div className="text-gray-500">Updated At</div>
            <div className="text-gray-900">
              {new Date(course.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </AppDrawer>
  );
}
