import { Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "@/lib/helpers";
import {
  Enrollment,
  EnrollmentStatus,
  PaymentStatus,
} from "@/types/api/enrollment";

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
    render: (enrollment: Enrollment) => `${enrollment.feeAmount} MMK`,
  },
  {
    key: "feeStatus",
    label: "Payment Status",
    render: (enrollment: Enrollment) => {
      const statusMap: Record<string, "outline" | "destructive" | "default"> = {
        [PaymentStatus.PENDING]: "outline",
        [PaymentStatus.OVERDUE]: "destructive",
        [PaymentStatus.PAID]: "default",
      };
      const variant = statusMap[enrollment.feeStatus] || "default";
      return (
        <Badge variant={variant}>{capitalize(enrollment.feeStatus)}</Badge>
      );
    },
  },
  {
    key: "enrollmentStatus",
    label: "Enrollment Status",
    render: (enrollment: Enrollment) => {
      const statusMap: Record<string, "outline" | "destructive" | "default"> = {
        [EnrollmentStatus.ACTIVE]: "default",
        [EnrollmentStatus.COMPLETED]: "outline",
        [EnrollmentStatus.DROPPED]: "destructive",
      };
      const variant = statusMap[enrollment.enrollmentStatus] || "default";
      return (
        <Badge variant={variant}>
          {capitalize(enrollment.enrollmentStatus)}
        </Badge>
      );
    },
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
