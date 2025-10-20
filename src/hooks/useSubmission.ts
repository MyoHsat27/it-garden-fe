import { useRead, useWrite } from "@/lib/queryClient";
import { Assignment } from "@/types/api/assignment";

export const useCreateSubmission = () => {
  return useWrite<Assignment>({
    queryKey: ["assignments/students/filtered"],
    url: "/submissions",
    method: "POST",
  });
};

export const useGradeSubmission = (submissionId?: number) => {
  return useWrite<Assignment>({
    queryKey: ["assignments/filtered"],
    url: `/submissions/${submissionId}/grade`,
    method: "PUT",
  });
};

export const useGetSubmissionByAssignment = (assignmentId?: number) => {
  return useRead<Assignment>({
    queryKey: ["assignments/filtered"],
    url: `/submissions/${assignmentId}/grade`,
  });
};
