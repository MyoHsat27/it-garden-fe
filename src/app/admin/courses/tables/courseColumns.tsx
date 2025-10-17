import { Column } from "@/components/common/DataTable";
import { truncateDescription } from "@/lib/helpers";
import { Course } from "@/types/api/course";

export const courseColumns: Column<Course>[] = [
  { key: "id", label: "ID", className: "" },
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
  { key: "duration", label: "Duration" },
  {
    key: "description",
    label: "Description",
    render: (course: Course) => truncateDescription(course.description, 5),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (course: Course) => new Date(course.createdAt).toLocaleDateString(),
  },
];
