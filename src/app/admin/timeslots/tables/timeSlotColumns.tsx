import { Column } from "@/components/common/DataTable";
import { TimeSlot } from "@/types/api/timeSlot";

export const timeSlotColumns: Column<TimeSlot>[] = [
  { key: "id", label: "ID", className: "" },
  { key: "name", label: "Name" },
  {
    key: "createdAt",
    label: "Created At",
    render: (timeSlot: TimeSlot) =>
      new Date(timeSlot.createdAt).toLocaleDateString(),
  },
];
