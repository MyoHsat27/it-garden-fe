import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Batch } from "@/types/api/batch";

interface BatchDetailDrawerProps {
  batch: Batch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchDetailDrawer({
  batch,
  open,
  onOpenChange,
}: BatchDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Batch Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-6 text-md">
        {/* Batch Info */}
        <div className="border rounded-lg p-4 shadow-sm bg-white ">
          <h3 className="text-lg font-semibold mb-2">Batch Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">ID</div>
            <div className="text-gray-900">{batch.id}</div>

            <div className="text-gray-500">Name</div>
            <div className="text-gray-900">{batch.name}</div>

            <div className="text-gray-500">Status</div>
            <div className="text-gray-900">{batch.status}</div>

            <div className="text-gray-500">Start Date</div>
            <div className="text-gray-900">
              {new Date(batch.startDate).toLocaleDateString()}
            </div>

            <div className="text-gray-500">End Date</div>
            <div className="text-gray-900">
              {new Date(batch.endDate).toLocaleDateString()}
            </div>

            <div className="text-gray-500">Description</div>
            <div className="text-gray-900">{batch.description}</div>

            <div className="text-gray-500">Created At</div>
            <div className="text-gray-900">
              {new Date(batch.createdAt).toLocaleString()}
            </div>

            <div className="text-gray-500">Updated At</div>
            <div className="text-gray-900">
              {new Date(batch.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Course Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Name</div>
            <div className="text-gray-900">{batch.course.name}</div>

            <div className="text-gray-500">Price</div>
            <div className="text-gray-900">{batch.course.price} MMK</div>

            <div className="text-gray-500">Duration</div>
            <div className="text-gray-900">{batch.course.duration}</div>

            <div className="text-gray-500">Description</div>
            <div className="text-gray-900">{batch.course.description}</div>
          </div>
        </div>

        {/* Teacher Info */}
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Teacher Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Name</div>
            <div className="text-gray-900">{batch.teacher.fullName}</div>

            <div className="text-gray-500">Phone</div>
            <div className="text-gray-900">{batch.teacher.phone}</div>

            <div className="text-gray-500">Gender</div>
            <div className="text-gray-900">{batch.teacher.gender}</div>

            <div className="text-gray-500">Address</div>
            <div className="text-gray-900">{batch.teacher.address}</div>
          </div>
        </div>

        {/* Classroom Info */}
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Classroom Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Name</div>
            <div className="text-gray-900">{batch.classroom.name}</div>

            <div className="text-gray-500">Capacity</div>
            <div className="text-gray-900">{batch.classroom.capacity}</div>
          </div>
        </div>

        {/* Timetable */}
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Timetable</h3>
          {batch.timetables.length === 0 ? (
            <div className="text-gray-500">No timetable assigned</div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {batch.timetables.map((tt) => (
                <div key={tt.id} className="border rounded p-2 bg-gray-50">
                  <div className="text-gray-500">Day</div>
                  <div className="text-gray-900">
                    {
                      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                        tt.dayOfWeek
                      ]
                    }
                  </div>

                  <div className="text-gray-500">Time Slot</div>
                  <div className="text-gray-900">
                    {tt.timeSlot.startTime} - {tt.timeSlot.endTime}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppDrawer>
  );
}
