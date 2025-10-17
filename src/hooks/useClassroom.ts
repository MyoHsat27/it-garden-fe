import { useRead, useWrite } from "@/lib/queryClient";
import { Classroom } from "@/types/api/classroom";
import { PaginatedResponse } from "@/types/api/pagination";

interface ClassroomFilter {
  search?: string;
  page?: number;
  limit?: number;
}
export const useGetFilteredClassrooms = (filter: ClassroomFilter) => {
  return useRead<PaginatedResponse<Classroom>>({
    queryKey: ["classrooms/filtered", JSON.stringify(filter)],
    url: "/classrooms/filtered",
    params: filter,
  });
};

export const useGetAllClassrooms = () => {
  return useRead<{ data: Classroom[] }>({
    queryKey: ["classrooms"],
    url: "/classrooms",
  });
};

export const useCreateClassroom = () => {
  return useWrite<Classroom>({
    queryKey: ["classrooms/filtered"],
    url: "/classrooms",
    method: "POST",
  });
};

export const useUpdateClassroom = (classroomId?: number) => {
  return useWrite<Classroom>({
    queryKey: ["classrooms/filtered"],
    url: `/classrooms/${classroomId}`,
    method: "PUT",
  });
};

export const useDeleteClassroom = (classroomId?: number) => {
  return useWrite<{ data: null }>({
    queryKey: ["classrooms/filtered"],
    url: `/classrooms/${classroomId}`,
    method: "DELETE",
  });
};
