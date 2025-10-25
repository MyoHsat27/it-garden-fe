import { useRead, useWrite } from "@/lib/queryClient";
import { Assignment } from "@/types/api/assignment";
import { Submission } from "@/types/api/submission";

export const useCreateSubmission = () => {
  return useWrite<Assignment>({
    queryKey: ["assignments/students/filtered"],
    url: "/submissions",
    method: "POST",
  });
};

export const useGradeSubmission = (
  assignmentId: number,
  submissionId: number
) => {
  return useWrite<Assignment>({
    queryKey: [`/submissions/assignment/${assignmentId}`],
    url: `/submissions/${submissionId}/grade`,
    method: "PUT",
  });
};

export const useGetSubmissionByAssignment = (assignmentId?: number) => {
  return useRead<{ data: Submission[] }>({
    queryKey: [`/submissions/assignment/${assignmentId}`],
    url: `/submissions/assignment/${assignmentId}`,
  });
};
