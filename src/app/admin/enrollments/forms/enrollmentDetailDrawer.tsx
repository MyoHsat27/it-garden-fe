import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Enrollment } from "@/types/api/enrollment";

interface EnrollmentDetailDrawerProps {
  enrollment: Enrollment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrollmentDetailDrawer({
  enrollment,
  open,
  onOpenChange,
}: EnrollmentDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Enrollment Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Enrollment Info */}
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Enrollment Info</h3>
          <div className="grid grid-cols-2 gap-2 text-md">
            <div className="text-gray-500">Enrolled At</div>
            <div className="text-gray-900">
              {new Date(enrollment.createdAt).toLocaleString()}
            </div>

            <div className="text-gray-500">Fee Amount</div>
            <div className="text-gray-900">{enrollment.feeAmount}</div>

            <div className="text-gray-500">Discount Amount</div>
            <div className="text-gray-900">{enrollment.discountAmount}</div>

            <div className="text-gray-500">Final Fee</div>
            <div className="text-gray-900">{enrollment.finalFee}</div>

            <div className="text-gray-500">Payment Method</div>
            <div className="text-gray-900">
              {enrollment?.payment?.paymentMethod ?? ""}
            </div>

            <div className="text-gray-500">Enrollment Status</div>
            <div className="text-gray-900">{enrollment.enrollmentStatus}</div>

            <div className="text-gray-500">Payment Status</div>
            <div className="text-gray-900">{enrollment.feeStatus}</div>

            <div className="text-gray-500">Due Date</div>
            <div className="text-gray-900">
              {new Date(enrollment.dueDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="border rounded-lg p-4 shadow-sm bg-white text-md">
          <h3 className="text-lg font-semibold mb-2">Student Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Name</div>
            <div className="text-gray-900">{enrollment.student.fullName}</div>

            <div className="text-gray-500">Phone</div>
            <div className="text-gray-900">{enrollment.student.phone}</div>

            <div className="text-gray-500">Registration No</div>
            <div className="text-gray-900">
              {enrollment.student.registrationNumber}
            </div>
          </div>
        </div>

        {/* Batch Info */}
        <div className="border rounded-lg p-4 shadow-sm bg-white text-md">
          <h3 className="text-lg font-semibold mb-2">Batch Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Name</div>
            <div className="text-gray-900">{enrollment.batch.name}</div>

            <div className="text-gray-500">Start Date</div>
            <div className="text-gray-900">
              {new Date(enrollment.batch.startDate).toLocaleDateString()}
            </div>

            <div className="text-gray-500">End Date</div>
            <div className="text-gray-900">
              {new Date(enrollment.batch.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </AppDrawer>
  );
}
