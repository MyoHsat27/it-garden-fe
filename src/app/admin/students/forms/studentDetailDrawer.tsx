import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/api/student";

interface StudentDetailDrawerProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailDrawer({
  student,
  open,
  onOpenChange,
}: StudentDetailDrawerProps) {
  return (
    <AppDrawer
      open={open}
      title="Student Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Basic Info */}
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-md text-gray-500">Registration No</div>
            <div className="text-md text-gray-900">
              {student.registrationNumber}
            </div>

            <div className="text-md text-gray-500">Name</div>
            <div className="text-md text-gray-900">{student.fullName}</div>

            <div className="text-md text-gray-500">Phone</div>
            <div className="text-md text-gray-900">{student.phone}</div>

            <div className="text-md text-gray-500">Gender</div>
            <div className="text-md text-gray-900">{student.gender}</div>

            <div className="text-md text-gray-500">Address</div>
            <div className="col-span-1 text-md text-gray-900">
              {student.address}
            </div>

            <div className="text-md text-gray-500">Created At</div>
            <div className="text-md text-gray-900">
              {new Date(student.createdAt).toLocaleString()}
            </div>

            <div className="text-md text-gray-500">Updated At</div>
            <div className="text-md text-gray-900">
              {new Date(student.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Guardian Info */}
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Guardian Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-md text-gray-500">Name</div>
            <div className="text-md text-gray-900">{student.guardianName}</div>

            <div className="text-md text-gray-500">Contact</div>
            <div className="text-md text-gray-900">
              {student.guardianContact}
            </div>
          </div>
        </div>
      </div>
    </AppDrawer>
  );
}
