import { Gender } from "@/constants/gender";
export enum AttendanceSessionStatus {
  PENDING = "pending",
  FINISHED = "finished",
}

export enum AttendanceRecordStatus {
  SCHEDULED = "scheduled",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

export interface AttendanceSession {
  id: string;
  timetableId: number;
  batchId: string;
  batchName: string;
  courseName: Gender;
  teacherName: string;
  classroomName: string;
  date: string;
  token: string;
  expiredAt: string;
  startTime: string;
  endTime: string;
  status: AttendanceSessionStatus;
  attendanceSummary: string;
}

export interface AttendanceRecord {
  id: number;
  enrollmentId: number;
  timetableId: number;
  studentName: string;
  date: string;
  present: boolean;
  status: AttendanceRecordStatus;
  token: string;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
