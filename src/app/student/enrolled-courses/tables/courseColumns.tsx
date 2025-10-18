import { Column } from "@/components/common/DataTable";
import { truncateDescription } from "@/lib/helpers";
import { Batch } from "@/types/api/batch";

export const courseColumns: Column<Batch>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "course",
    label: "Course",
    render: (batch: Batch) => `${batch.course.name}`,
  },
  {
    key: "price",
    label: "Price",
    render: (batch: Batch) => `${batch.course.price} MMK`,
  },
  {
    key: "duration",
    label: "Duration",
    render: (batch: Batch) => `${batch.course.duration}`,
  },
  {
    key: "description",
    label: "Description",
    render: (batch: Batch) => truncateDescription(batch.description, 5),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (batch: Batch) => new Date(batch.createdAt).toLocaleDateString(),
  },
];
