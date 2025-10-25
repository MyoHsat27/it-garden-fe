"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleFormError } from "@/lib/helpers";
import { useGradeSubmission } from "@/hooks/useSubmission";

interface GradeSubmissionDialogProps {
  assignmentId: number;
  submissionId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GradeSubmissionDialog({
  assignmentId,
  submissionId,
  open,
  onOpenChange,
}: GradeSubmissionDialogProps) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const mutation = useGradeSubmission(assignmentId, submissionId);

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync({ grade, feedback });
      onOpenChange(false);
    } catch (err) {
      handleFormError(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Grade</label>
            <Input
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Enter grade (e.g., A, B+, 90)"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Feedback</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write feedback for the student"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Submit Grade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
