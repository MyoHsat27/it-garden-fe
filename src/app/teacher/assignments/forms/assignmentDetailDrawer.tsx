"use client";

import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Assignment, StudentAssignment } from "@/types/api/assignment";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useGetSubmissionByAssignment } from "@/hooks/useSubmission";
import { Submission } from "@/types/api/submission";
import { axiosApi } from "@/lib/axios";
import { handleFormError } from "@/lib/helpers";
import { GradeSubmissionDialog } from "./gradeSubmissionDialog";
import { Badge } from "@/components/ui/badge";

interface AssignmentDetailDrawerProps {
  assignment: Assignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignmentDetailDrawer({
  assignment,
  open,
  onOpenChange,
}: AssignmentDetailDrawerProps) {
  const { data, isLoading } = useGetSubmissionByAssignment(assignment.id);
  const submissions =
    data?.data?.slice()?.sort((a: Submission, b: Submission) => {
      const aGraded = a.grade ? 1 : 0;
      const bGraded = b.grade ? 1 : 0;
      return aGraded - bGraded;
    }) || [];

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
            <strong>Batch:</strong> {assignment.batch?.name || "N/A"}
          </div>
          <div>
            <strong>Course:</strong> {assignment.batch?.course?.name || "N/A"}
          </div>
          <div>
            <strong>Start Date:</strong>{" "}
            {new Date(assignment.startDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Due Date:</strong>{" "}
            {new Date(assignment.dueDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Total Required:</strong>{" "}
            {assignment.totalRequiredSubmissions}
          </div>
          <div>
            <strong>Pending:</strong>{" "}
            <Badge variant={"destructive"}>
              {assignment.pendingSubmissionCount}
            </Badge>
          </div>
          <div>
            <strong>Submitted:</strong>{" "}
            <Badge className="bg-green-500">
              {assignment.currentSubmissionCount}
            </Badge>
          </div>
          <div>
            <strong>Graded:</strong>{" "}
            <Badge>{assignment.gradedSubmissionCount}</Badge>
          </div>
          {assignment.media && (
            <div className="col-span-2">
              <strong>Attachment:</strong>{" "}
              <a
                download
                target="_blank"
                href={assignment.media.url}
                className="text-blue-600 underline"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
      {/* Submissions */}
      <div className="border-t pt-3">
        <h3 className="font-semibold mb-2">Submissions</h3>
        {isLoading ? (
          <p>Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <div className="space-y-2">
            {submissions.map((submission: any) => (
              <SubmissionDropdown
                key={submission.id}
                submission={submission}
                assignmentId={assignment.id}
              />
            ))}
          </div>
        )}
      </div>
    </AppDrawer>
  );
}

function SubmissionDropdown({
  submission,
  assignmentId,
}: {
  submission: Submission;
  assignmentId: number;
}) {
  const [open, setOpen] = useState(false);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const handleDownload = async () => {
    try {
      const res = await axiosApi.get(`/submissions/download/${submission.id}`, {
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

  const graded = submission.grade !== null && submission.grade !== undefined;

  return (
    <>
      {" "}
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="border rounded-md"
      >
        <CollapsibleTrigger asChild>
          <button
            className="flex justify-between w-full p-3 text-left hover:bg-muted/50"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium">
                  {submission.enrollment?.student?.fullName ??
                    "Unnamed Student"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {submission.submittedAt
                    ? new Date(submission.submittedAt).toLocaleString()
                    : "Not submitted"}
                </p>
              </div>

              <Badge
                className={
                  graded
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-black"
                }
              >
                {graded ? "Graded" : "Not Graded"}
              </Badge>
            </div>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="p-3 border-t bg-muted/30 text-sm space-y-2">
          <p>
            <strong>Status:</strong> {submission.status}
          </p>
          <p>
            <strong>Grade:</strong> {submission.grade ?? "Not graded"}
          </p>
          {submission.feedback && (
            <p>
              <strong>Feedback:</strong> {submission.feedback}
            </p>
          )}
          {submission.content && (
            <p>
              <strong>Content:</strong> {submission.content}
            </p>
          )}
          {submission.media && (
            <a onClick={handleDownload} className="text-blue-600 underline">
              Download Submitted File
            </a>
          )}
          <div className="pt-2 ">
            <Button
              size="sm"
              className="cursor-pointer"
              onClick={() => setGradeDialogOpen(true)}
            >
              Grade Submission
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <GradeSubmissionDialog
        assignmentId={assignmentId}
        submissionId={submission.id}
        open={gradeDialogOpen}
        onOpenChange={setGradeDialogOpen}
      />
    </>
  );
}
