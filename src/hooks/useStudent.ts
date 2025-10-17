import { useRead, useWrite } from "@/lib/queryClient";
import { Student } from "@/types/api/student";
import { PaginatedResponse } from "@/types/api/pagination";

interface StudentFilter {
  search?: string;
  page?: number;
  limit?: number;
}
export const useGetFilteredStudents = (filter: StudentFilter) => {
  return useRead<PaginatedResponse<Student>>({
    queryKey: ["students/filtered", JSON.stringify(filter)],
    url: "/students/filtered",
    params: filter,
  });
};

export const useGetAllStudents = () => {
  return useRead<{ data: Student[] }>({
    queryKey: ["students"],
    url: "/students",
  });
};

export const useCreateStudent = () => {
  return useWrite<Student>({
    queryKey: ["students/filtered"],
    url: "/students",
    method: "POST",
  });
};

export const useUpdateStudent = (studentId?: number) => {
  return useWrite<Student>({
    queryKey: ["students/filtered"],
    url: `/students/${studentId}`,
    method: "PUT",
  });
};

export const useDeleteStudent = (studentId?: number) => {
  return useWrite<{ data: null }>({
    queryKey: ["students/filtered"],
    url: `/students/${studentId}`,
    method: "DELETE",
  });
};
