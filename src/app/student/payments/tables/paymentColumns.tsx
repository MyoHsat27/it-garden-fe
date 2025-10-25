import { Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/types/api/payment";

export const paymentColumns: Column<Payment>[] = [
  { key: "id", label: "ID" },
  { key: "courseName", label: "Course", render: () => "Machine Learning" },
  { key: "amount", label: " Amount" },
  { key: "paymentMethod", label: " Method" },
  {
    key: "status",
    label: " Status",
    render: () => <Badge className="bg-green-600">Paid</Badge>,
  },
  {
    key: "paidAt",
    label: "Payment Date",
    render: (payment: Payment) => new Date(payment.paidAt).toLocaleDateString(),
  },
];
