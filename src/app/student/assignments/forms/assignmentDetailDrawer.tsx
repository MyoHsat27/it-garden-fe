"use client";

import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { StudentAssignment } from "@/types/api/assignment";
import { axiosApi } from "@/lib/axios";
import { handleFormError } from "@/lib/helpers";

interface AssignmentDetailDrawerProps {
  assignment: StudentAssignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignmentDetailDrawer({
  assignment,
  open,
  onOpenChange,
}: AssignmentDetailDrawerProps) {
  const handleDownload = async () => {
    try {
      const res = await axiosApi.get(`/assignments/download/${assignment.id}`, {
        responseType: "blob",
      });

      const contentDisposition = res.headers["content-disposition"];
      let fileName = "submission-file";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) fileName = match[1];
      }

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      handleFormError(err);
    }
  };

  return (
    <AppDrawer
      open={open}
      title="Assignment Detail"
      onOpenChange={onOpenChange}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-2 mb-5">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div>
            <strong>Title:</strong> {assignment.title}
          </div>
          <div className="col-span-2">
            <strong>Description:</strong>{" "}
            {assignment.description || "No description provided"}
          </div>
          <div>
            <strong>Batch:</strong> {assignment.batchName || "N/A"}
          </div>
          <div>
            <strong>Course:</strong> {assignment.courseName || "N/A"}
          </div>
          <div>
            <strong>Start Date:</strong>{" "}
            {new Date(assignment.startDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Due Date:</strong>{" "}
            {new Date(assignment.dueDate).toLocaleDateString()}
          </div>
          {assignment.media && (
            <Button size="sm" className="text-xs" onClick={handleDownload}>
              Download Assignment File
            </Button>
          )}
        </div>
      </div>
    </AppDrawer>
  );
}
