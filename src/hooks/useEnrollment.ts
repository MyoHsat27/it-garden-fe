import { useRead, useWrite } from "@/lib/queryClient";
import { Enrollment } from "@/types/api/enrollment";
import { PaginatedResponse } from "@/types/api/pagination";

interface EnrollmentFilter {
  search?: string;
  enrollmentStatus?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
}
export const useGetFilteredEnrollments = (filter: EnrollmentFilter) => {
  return useRead<PaginatedResponse<Enrollment>>({
    queryKey: ["enrollments/filtered", JSON.stringify(filter)],
    url: "/enrollments/filtered",
    params: filter,
  });
};

export const useCreateEnrollment = () => {
  return useWrite<Enrollment>({
    queryKey: ["enrollments/filtered"],
    url: "/enrollments",
    method: "POST",
  });
};

export const useUpdateEnrollment = (enrollmentId?: number) => {
  return useWrite<Enrollment>({
    queryKey: ["enrollments/filtered"],
    url: `/enrollments/${enrollmentId}`,
    method: "PUT",
  });
};

export const useDeleteEnrollment = (enrollmentId?: number) => {
  return useWrite<{ data: null }>({
    queryKey: ["enrollments/filtered"],
    url: `/enrollments/${enrollmentId}`,
    method: "DELETE",
  });
};
