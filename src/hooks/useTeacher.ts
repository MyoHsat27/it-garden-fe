import { useRead, useWrite } from "@/lib/queryClient";
import { Teacher } from "@/types/api/teacher";
import { PaginatedResponse } from "@/types/api/pagination";

interface TeacherFilter {
  search?: string;
  page?: number;
  limit?: number;
}
export const useGetFilteredTeachers = (filter: TeacherFilter) => {
  return useRead<PaginatedResponse<Teacher>>({
    queryKey: ["teachers/filtered", JSON.stringify(filter)],
    url: "/teachers/filtered",
    params: filter,
  });
};

export const useGetAllTeachers = () => {
  return useRead<{ data: Teacher[] }>({
    queryKey: ["teachers"],
    url: "/teachers",
  });
};

export const useCreateTeacher = () => {
  return useWrite<Teacher>({
    queryKey: ["teachers/filtered"],
    url: "/teachers",
    method: "POST",
  });
};

export const useUpdateTeacher = (teacherId?: number) => {
  return useWrite<Teacher>({
    queryKey: ["teachers/filtered"],
    url: `/teachers/${teacherId}`,
    method: "PUT",
  });
};

export const useDeleteTeacher = (teacherId?: number) => {
  return useWrite<{ data: null }>({
    queryKey: ["teachers/filtered"],
    url: `/teachers/${teacherId}`,
    method: "DELETE",
  });
};
