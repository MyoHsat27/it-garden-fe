import { useRead, useWrite } from "@/lib/queryClient";
import { AttendanceRecord, AttendanceSession } from "@/types/api/attendance";
import { PaginatedResponse } from "@/types/api/pagination";

interface TimetableSessionFilter {
  search?: string;
  page?: number;
  limit?: number;
}

export const useGetTimetableSessions = (
  teacherId: number,
  query: TimetableSessionFilter
) => {
  return useRead<PaginatedResponse<AttendanceSession>>({
    queryKey: [
      `attendances/teachers/${teacherId}/sessions`,
      JSON.stringify(query),
    ],
    url: `attendances/teachers/${teacherId}/sessions`,
    params: query,
  });
};

export const useGenerateAttendanceRecords = (
  teacherId: number,
  sessionId: string
) => {
  return useWrite<{ data: AttendanceRecord[] }>({
    queryKey: [`attendances/teachers/${teacherId}/sessions`],
    url: `attendances/sessions/${sessionId}/generate`,
  });
};

export const useGetGeneratedAttendanceRecords = (sessionId: string) => {
  return useRead<{ data: AttendanceRecord[] }>({
    queryKey: [`attendances/sessions/${sessionId}/records`],
    url: `attendances/sessions/${sessionId}/records`,
  });
};

export const useUpdateAttendanceRecords = (
  sessionId: string,
  teacherId: number
) => {
  return useWrite<{ data: AttendanceRecord[] }>({
    queryKey: [
      [`attendances/sessions/${sessionId}/records`],
      [`attendances/teachers/${teacherId}/sessions`],
    ],
    url: `attendances/records`,
    method: "PUT",
  });
};

export const useScanAttendanceRecords = (token: string) => {
  return useWrite<{ data: AttendanceRecord[] }>({
    url: `attendances/records/scan/${token}`,
    method: "POST",
  });
};
