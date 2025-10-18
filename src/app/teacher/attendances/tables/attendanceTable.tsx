"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  AttendanceSession,
  AttendanceSessionStatus,
} from "@/types/api/attendance";
import {
  useGenerateAttendanceRecords,
  useGetTimetableSessions,
} from "@/hooks/useAttendance";
import { attendanceColumns } from "./attendanceColumns";
import { AttendanceDetailDrawer } from "../forms/attendanceDetailDrawer";
import { Button } from "@/components/ui/button";
import { CalendarSync } from "lucide-react";
import { formatTimeAMPM, handleFormError, isToday } from "@/lib/helpers";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export function AttendanceTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedAttendanceSession, setSelectedAttendanceSession] =
    useState<AttendanceSession | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const { user } = useAuth();

  const teacherId = user?.teacherProfile?.id;

  const { data: attendancesRes, isLoading } = useGetTimetableSessions(
    teacherId ?? 0,
    { search, page, limit }
  );

  const { mutate: generateMutation, isPending: isGeneratePending } =
    useGenerateAttendanceRecords(
      teacherId ?? 0,
      selectedAttendanceSession?.id ?? ""
    );

  const attendances = attendancesRes?.data ?? [];
  const total =
    attendancesRes?.meta?.pagination?.totalItems ?? attendances.length;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (attendance: AttendanceSession) => {
    setSelectedAttendanceSession(attendance);
    setShowDetailDrawer(true);
  };

  const handleGenerate = (attendance: AttendanceSession) => {
    setSelectedAttendanceSession(attendance);
    setShowGenerateModal(true);
  };

  const confirmGenerate = () => {
    if (selectedAttendanceSession && teacherId) {
      generateMutation({
        onSuccess: () => setShowGenerateModal(false),
        onError: (err: any) => handleFormError(err),
      });
    }
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Attendances</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={attendanceColumns}
          data={attendances}
          isLoading={isLoading}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onView={handleView}
          renderActions={(attendance: AttendanceSession) =>
            attendance.status !== AttendanceSessionStatus.FINISHED &&
            isToday(attendance.date) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600"
                onClick={() => handleGenerate(attendance)}
              >
                <CalendarSync />
              </Button>
            )
          }
        />
      </CardContent>

      {showDetailDrawer && selectedAttendanceSession && (
        <AttendanceDetailDrawer
          attendance={selectedAttendanceSession}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}

      {showGenerateModal && selectedAttendanceSession && (
        <ConfirmationDialog
          title="Generate Attendance Records"
          description={`You are about to generate attendance records for the session:
                - Batch: ${selectedAttendanceSession.batchName}
                - Course: ${selectedAttendanceSession.courseName}
                - Date: ${new Date(
                  selectedAttendanceSession.date
                ).toDateString()} | ${formatTimeAMPM(
            selectedAttendanceSession.startTime
          )} - ${formatTimeAMPM(selectedAttendanceSession.endTime)} \n
                This will create attendance records for all students in this session. 
                Do you want to continue?`}
          open={showGenerateModal}
          onOpenChange={setShowGenerateModal}
          onConfirm={confirmGenerate}
          confirmButtonVariant={"default"}
          confirmButtonDisable={isGeneratePending}
          confirmText={isGeneratePending ? "Generating" : "Generate"}
        />
      )}
    </Card>
  );
}
