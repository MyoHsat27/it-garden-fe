"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useScanAttendanceRecords } from "@/hooks/useAttendance";
import { toast } from "sonner";
import { handleFormError } from "@/lib/helpers";
import { useRouter } from "next/navigation";

export default function AttendanceScanPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const {
    mutate: scanAttendance,
    isPending,
    isSuccess,
    isError,
    data,
    error,
  } = useScanAttendanceRecords(token ?? "");

  useEffect(() => {
    if (token) {
      scanAttendance(
        {},
        {
          onSuccess: () => {
            toast.success("Attendance recorded successfully");
            setTimeout(() => {
              router.push("/student");
            }, 1500);
          },

          onError: (err: any) => handleFormError(err),
        }
      );
    }
  }, [token, scanAttendance]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {isPending && <h2>⏳ Marking attendance...</h2>}
      {isSuccess && (
        <>
          <h2>✅ Attendance recorded successfully!</h2>
        </>
      )}
      {isError && (
        <>
          <h2>❌ Failed to record attendance</h2>
          <p>{(error as any)?.message ?? "Something went wrong"}</p>
        </>
      )}
    </div>
  );
}
