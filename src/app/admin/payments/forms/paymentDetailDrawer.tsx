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
  const enrollment = payment.enrollment;
  const student = enrollment?.student;
  const batch = enrollment?.batch;
  const course = batch?.course;

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
      <div className="flex flex-col gap-6 text-md">
        {/* Payment Info */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Payment Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">ID</div>
            <div className="text-gray-900">{payment.id}</div>

            <div className="text-gray-500">Amount</div>
            <div className="text-gray-900">{payment.amount} MMK</div>

            <div className="text-gray-500">Method</div>
            <div className="text-gray-900">{payment.paymentMethod}</div>

            <div className="text-gray-500">Paid At</div>
            <div className="text-gray-900">
              {new Date(payment.paidAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Student Info */}
        {student && (
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Student Info</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500">Name</div>
              <div className="text-gray-900">{student.fullName}</div>

              <div className="text-gray-500">Phone</div>
              <div className="text-gray-900">{student.phone}</div>

              <div className="text-gray-500">Gender</div>
              <div className="text-gray-900">{student.gender}</div>
            </div>
          </div>
        )}

        {/* Batch Info */}
        {batch && (
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Batch Info</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500">Batch Name</div>
              <div className="text-gray-900">{batch.name}</div>

              <div className="text-gray-500">Status</div>
              <div className="text-gray-900">{batch.status}</div>

              <div className="text-gray-500">Start Date</div>
              <div className="text-gray-900">
                {new Date(batch.startDate).toLocaleDateString()}
              </div>

              <div className="text-gray-500">End Date</div>
              <div className="text-gray-900">
                {new Date(batch.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* Course Info */}
        {course && (
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Course Info</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500">Course Name</div>
              <div className="text-gray-900">{course.name}</div>

              <div className="text-gray-500">Price</div>
              <div className="text-gray-900">{course.price} MMK</div>

              <div className="text-gray-500">Duration</div>
              <div className="text-gray-900">{course.duration}</div>
            </div>
          </div>
        )}
      </div>
    </AppDrawer>
  );
}
