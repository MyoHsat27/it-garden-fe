import { Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatTimeAMPM, getDayOfWeek } from "@/lib/helpers";
import { TimeSlot } from "@/types/api/timeSlot";

export const timeSlotColumns: Column<TimeSlot>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "startTime",
    label: "Start Time",
    render: (timeSlot: TimeSlot) => (
      <Badge>{formatTimeAMPM(timeSlot.startTime)}</Badge>
    ),
  },
  {
    key: "endTime",
    label: "End Time",
    render: (timeSlot: TimeSlot) => (
      <Badge>{formatTimeAMPM(timeSlot.endTime)}</Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (timeSlot: TimeSlot) =>
      new Date(timeSlot.createdAt).toLocaleDateString(),
  },
];
