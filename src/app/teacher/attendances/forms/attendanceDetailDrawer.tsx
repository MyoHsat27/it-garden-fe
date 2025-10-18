import { AppDrawer } from "@/components/common/AppDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  useGetGeneratedAttendanceRecords,
  useUpdateAttendanceRecords,
} from "@/hooks/useAttendance";
import { handleFormError } from "@/lib/helpers";
import { AttendanceRecord, AttendanceSession } from "@/types/api/attendance";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AttendanceDetailDrawerProps {
  attendance: AttendanceSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendanceDetailDrawer({
  attendance,
  open,
  onOpenChange,
}: AttendanceDetailDrawerProps) {
  const { user } = useAuth();

  const teacherId = user?.teacherProfile?.id;

  const { data: recordRes, isLoading } = useGetGeneratedAttendanceRecords(
    attendance.id
  );
  const { mutate: updateRecord, isPending: isUpdating } =
    useUpdateAttendanceRecords(attendance.id, teacherId ?? 0);

  const handleMarkPresent = (record: AttendanceRecord) => {
    updateRecord(
      { id: record.id, present: true },
      {
        onSuccess: () =>
          toast.success(`${record.studentName} is marked as present.`),
        onError: (err: any) => handleFormError(err),
      }
    );
  };

  return (
    <AppDrawer
      open={open}
      title="Attendance Records"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      {isLoading ? (
        <p className="text-gray-500">Loading records...</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="text-md">{`${attendance.batchName} - ${
            attendance.courseName
          } - ${new Date(attendance.date).toDateString()}`}</div>
          {recordRes?.data?.length ? (
            recordRes.data.map((record: AttendanceRecord) => (
              <div
                key={record.id}
                className="flex justify-between items-center border rounded-md px-4 py-2"
              >
                <div>
                  <div className="text-md">{record.studentName}</div>

                  <div>
                    {record.present ? (
                      <Badge className="bg-green-600">Present</Badge>
                    ) : (
                      <Badge variant={"destructive"}>Absent</Badge>
                    )}
                  </div>
                </div>
                {!record.present && (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                    onClick={() => handleMarkPresent(record)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <>
                        <CheckCircle2 />
                      </>
                    )}
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No attendance records generated yet.
            </p>
          )}
        </div>
      )}
    </AppDrawer>
  );
}
