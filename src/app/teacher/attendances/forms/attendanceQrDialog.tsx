"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { frontendUrl } from "@/constants/base-url";
import { AttendanceSession } from "@/types/api/attendance";
import QrCode from "react-qr-code";

interface AttendanceQrDialogProps {
  session: AttendanceSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendanceQrDialog({
  session,
  open,
  onOpenChange,
}: AttendanceQrDialogProps) {
  const qrUrl = `${frontendUrl}/student/attendances/scan?token=${session.token}`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">QR Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 mt-2">
          <div>
            {session.batchName} - {session.courseName} - {session.date}
          </div>
          <QrCode value={qrUrl} />
          <div>
            <strong>Expired At : </strong>
            {new Date(session.expiredAt).toLocaleString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
