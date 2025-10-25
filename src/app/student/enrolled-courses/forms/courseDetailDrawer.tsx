import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Batch } from "@/types/api/batch";

interface CourseDetailDrawerProps {
  batch: Batch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailDrawer({
  batch,
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
      <div className="flex flex-col gap-4">
        {/* Basic Info */}
        <div className="flex flex-col gap-1">
          <div>
            <span>ID:</span> {batch.id}
          </div>
          <div>
            <span>Name:</span> {batch.name}
          </div>
          <div>
            <span>Description:</span> {batch.description}
          </div>
          <div>
            <span>Teacher:</span> {batch.teacher.fullName}
          </div>
          <div>
            <span>Classroom:</span> {batch.classroom.name}
          </div>
          <div>
            <span>Joined At:</span> {new Date(batch.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Timetable */}
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">Timetable</h3>
          {batch.timetables.length === 0 ? (
            <div>No timetable assigned</div>
          ) : (
            batch.timetables.map((tt) => (
              <div key={tt.id} className="border p-2 rounded">
                <div>
                  <span>Day:</span>{" "}
                  {
                    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                      tt.dayOfWeek
                    ]
                  }
                </div>
                <div>
                  <span>Time:</span> {tt.timeSlot.startTime} -{" "}
                  {tt.timeSlot.endTime}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppDrawer>
  );
}
