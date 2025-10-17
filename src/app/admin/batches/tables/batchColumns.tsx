import { Column } from "@/components/common/DataTable";
import { truncateDescription } from "@/lib/helpers";
import { Batch } from "@/types/api/batch";

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
    key: "createdAt",
    label: "Created At",
    render: (batch: Batch) => new Date(batch.createdAt).toLocaleDateString(),
  },
];
