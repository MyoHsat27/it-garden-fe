import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Payment } from "@/types/api/payment";

interface PaymentDetailDrawerProps {
  payment: Payment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailDrawer({
  payment,
  open,
  onOpenChange,
}: PaymentDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Payment Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <strong>ID:</strong> {payment.id}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(payment.createdAt).toLocaleString()}
        </div>
      </div>
    </AppDrawer>
  );
}
