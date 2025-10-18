import { Column } from "@/components/common/DataTable";
import { Assignment } from "@/types/api/assignment";

export const enrollmentColumns: Column<Assignment>[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  {
    key: "startDate",
    label: "Start Date",
    render: (assignment: Assignment) =>
      new Date(assignment.startDate).toLocaleDateString(),
  },
  {
    key: "dueDate",
    label: "Due Date",
    render: (assignment: Assignment) =>
      new Date(assignment.dueDate).toLocaleDateString(),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (enrollment: Assignment) =>
      new Date(enrollment.createdAt).toLocaleDateString(),
  },
];
