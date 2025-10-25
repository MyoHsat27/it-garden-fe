import { Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Assignment } from "@/types/api/assignment";

export const enrollmentColumns: Column<Assignment>[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  {
    key: "course",
    label: "Course",
    render: () => "Data Structure",
  },
  {
    key: "classroom",
    label: "Classroom",
    render: () => "A-5",
  },
  {
    key: "startDate",
    label: "Exam Date",
    render: (assignment: Assignment) =>
      new Date(assignment.startDate).toLocaleDateString(),
  },
  {
    key: "score",
    label: "Score",
    render: (assignment: Assignment) => "90/100",
  },
];
