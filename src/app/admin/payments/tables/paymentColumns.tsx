import { Column } from "@/components/common/DataTable";
import { Payment } from "@/types/api/payment";

export const paymentColumns: Column<Payment>[] = [
  { key: "id", label: "ID" },
  {
    key: "paidAt",
    label: "Payment Date",
    render: (payment: Payment) => new Date(payment.paidAt).toLocaleDateString(),
  },
];
