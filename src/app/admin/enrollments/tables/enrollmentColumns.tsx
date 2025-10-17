import { Column } from "@/components/common/DataTable";
import { Enrollment } from "@/types/api/enrollment";

export const enrollmentColumns: Column<Enrollment>[] = [
  { key: "id", label: "ID" },
  {
    key: "student",
    label: "Student",
    render: (enrollment: Enrollment) => enrollment.student.fullName,
  },
  {
    key: "batch",
    label: "Batch",
    render: (enrollment: Enrollment) => enrollment.batch.name,
  },
  {
    key: "finalFee",
    label: "Fees",
  },
  {
    key: "feeStatus",
    label: "Payment Status",
  },
  {
    key: "enrollmentStatus",
    label: "Enrollment Status",
  },
  {
    key: "dueDate",
    label: "Due Date",
    render: (enrollment: Enrollment) =>
      new Date(enrollment.dueDate).toLocaleDateString(),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (enrollment: Enrollment) =>
      new Date(enrollment.createdAt).toLocaleDateString(),
  },
];
