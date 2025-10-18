import { Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatTimeAMPM } from "@/lib/helpers";
import {
  AttendanceRecordStatus,
  AttendanceSession,
  AttendanceSessionStatus,
} from "@/types/api/attendance";
import { Check, CircleCheck, Loader } from "lucide-react";

export const attendanceColumns: Column<AttendanceSession>[] = [
  { key: "id", label: "ID" },
  { key: "batchName", label: "Batch Name" },
  { key: "courseName", label: "Course Name" },
  { key: "teacherName", label: "Teacher Name" },
  { key: "classroomName", label: "Classroom Name" },
  {
    key: "date",
    label: "Date",
    render: (attendance: AttendanceSession) =>
      new Date(attendance.date).toDateString(),
  },
  {
    key: "startTime",
    label: "Start Time",
    render: (attendance: AttendanceSession) => (
      <Badge>{formatTimeAMPM(attendance.startTime)}</Badge>
    ),
  },
  {
    key: "endTime",
    label: "End Time",
    render: (attendance: AttendanceSession) => (
      <Badge>{formatTimeAMPM(attendance.endTime)}</Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (attendance: AttendanceSession) => {
      if (attendance.status === AttendanceSessionStatus.FINISHED)
        return (
          <Badge className="bg-green-600 rounded-full p-1">
            <CircleCheck className="w-5 h-5 font-bold" strokeWidth={3} />
          </Badge>
        );
      else if (attendance.status === AttendanceSessionStatus.PENDING)
        return (
          <Badge className="bg-yellow-500 rounded-full p-1">
            <Loader className="w-5 h-5 font-bold " strokeWidth={3} />
          </Badge>
        );
    },
  },
  {
    key: "attendanceSummary",
    label: "Attendance",
    render: (attendance: AttendanceSession) => {
      if (!attendance.attendanceSummary) return "-";

      const [present, total] = attendance.attendanceSummary.split("/");

      return (
        <Badge
          className={present === total ? "bg-green-600" : ""}
          variant={present === total ? "default" : "destructive"}
        >
          {present}/{total}
        </Badge>
      );
    },
  },
];
