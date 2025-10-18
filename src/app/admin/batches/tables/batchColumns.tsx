import { Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatTimeAMPM, getDayOfWeek } from "@/lib/helpers";
import { Batch, BatchStatus } from "@/types/api/batch";

export const batchColumns: Column<Batch>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "course",
    label: "Course",
    render: (batch: Batch) => batch.course.name,
  },
  {
    key: "teacher",
    label: "Instructor",
    render: (batch: Batch) => batch.teacher.fullName,
  },
  {
    key: "classroom",
    label: "Room",
    render: (batch: Batch) => batch.classroom.name,
  },
  {
    key: "timetables",
    label: "Sessions",
    render: (batch: Batch) => (
      <div className="flex flex-col gap-1">
        {batch.timetables.map((t) => (
          <Badge variant="outline">
            {getDayOfWeek(t.dayOfWeek)} {formatTimeAMPM(t.timeSlot.startTime)} -{" "}
            {formatTimeAMPM(t.timeSlot.endTime)}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (batch: Batch) => {
      if (batch.status === BatchStatus.ACTIVE) {
        return <Badge variant="default">Ongoing</Badge>;
      } else if (batch.status === BatchStatus.COMPLETED) {
        return <Badge variant="secondary">Completed</Badge>;
      } else {
        return <Badge variant="outline">Start on {batch.startDate}</Badge>;
      }
    },
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (batch: Batch) => new Date(batch.createdAt).toLocaleDateString(),
  },
];
