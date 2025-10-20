import { Column } from "@/components/common/DataTable";
import { StudentAssignment } from "@/types/api/assignment";

export const enrollmentColumns: Column<StudentAssignment>[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  {
    key: "batch",
    label: "Batch",
    render: (assignment: StudentAssignment) => assignment.batchName,
  },
  {
    key: "course",
    label: "Course",
    render: (assignment: StudentAssignment) => assignment.courseName,
  },
  {
    key: "startDate",
    label: "Start Date",
    render: (assignment: StudentAssignment) =>
      new Date(assignment.startDate).toDateString(),
  },
  {
    key: "dueDate",
    label: "Due Date",
    render: (assignment: StudentAssignment) =>
      new Date(assignment.dueDate).toDateString(),
  },
  {
    key: "assignmentStatus",
    label: "Assignment Status",
    render: (assignment: StudentAssignment) => assignment.status,
  },
  {
    key: "submissionStatus",
    label: "Submission Status",
    render: (assignment: StudentAssignment) =>
      assignment.submission ? assignment.submission.status : "-",
  },
];
