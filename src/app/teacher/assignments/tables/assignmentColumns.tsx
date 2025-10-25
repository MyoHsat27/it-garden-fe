import { Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Assignment } from "@/types/api/assignment";

export const enrollmentColumns: Column<Assignment>[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  {
    key: "submissionStats",
    label: "Submission Status",
    render: (assignment: Assignment) => (
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-blue-500 text-white">
          Total: {assignment.totalRequiredSubmissions}
        </Badge>
        <Badge variant="outline" className="bg-green-500 text-white">
          Submitted: {assignment.currentSubmissionCount}
        </Badge>
        <Badge variant="destructive">
          Pending: {assignment.pendingSubmissionCount}
        </Badge>
        <Badge variant="default">
          Graded: {assignment.gradedSubmissionCount}
        </Badge>
      </div>
    ),
  },
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
