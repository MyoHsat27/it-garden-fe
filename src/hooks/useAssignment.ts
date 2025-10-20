import { useRead, useWrite } from "@/lib/queryClient";
import { Assignment, StudentAssignment } from "@/types/api/assignment";
import { PaginatedResponse } from "@/types/api/pagination";

interface AssignmentFilter {
  search?: string;
  batchId?: number;
  teacherId?: number;
  studentId?: number;
  enrollmentId?: number;
  page?: number;
  limit?: number;
}

export const useGetFilteredAssignments = (filter: AssignmentFilter) => {
  return useRead<PaginatedResponse<Assignment>>({
    queryKey: ["assignments/filtered", JSON.stringify(filter)],
    url: "/assignments/filtered",
    params: filter,
  });
};

export const useGetFilteredStudentAssignments = (filter: AssignmentFilter) => {
  return useRead<PaginatedResponse<StudentAssignment>>({
    queryKey: ["assignments/students/filtered", JSON.stringify(filter)],
    url: "/assignments/students/filtered",
    params: filter,
  });
};

export const useCreateAssignment = () => {
  return useWrite<Assignment>({
    queryKey: ["assignments/filtered"],
    url: "/assignments",
    method: "POST",
  });
};

export const useUpdateAssignment = (assignmentId?: number) => {
  return useWrite<Assignment>({
    queryKey: ["assignments/filtered"],
    url: `/assignments/${assignmentId}`,
    method: "PUT",
  });
};

export const useDeleteAssignment = (assignmentId?: number) => {
  return useWrite<{ data: null }>({
    queryKey: ["assignments/filtered"],
    url: `/assignments/${assignmentId}`,
    method: "DELETE",
  });
};
