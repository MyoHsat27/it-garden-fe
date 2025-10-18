import { useRead, useWrite } from "@/lib/queryClient";
import { Course } from "@/types/api/course";
import { PaginatedResponse } from "@/types/api/pagination";

interface CourseFilter {
  studentId?: number;
  search?: string;
  page?: number;
  limit?: number;
}
export const useGetFilteredCourses = (filter: CourseFilter) => {
  return useRead<PaginatedResponse<Course>>({
    queryKey: ["courses/filtered", JSON.stringify(filter)],
    url: "/courses/filtered",
    params: filter,
  });
};

export const useGetAllCourses = () => {
  return useRead<{ data: Course[] }>({
    queryKey: ["courses"],
    url: "/courses",
  });
};

export const useCreateCourse = () => {
  return useWrite<Course>({
    queryKey: ["courses/filtered"],
    url: "/courses",
    method: "POST",
  });
};

export const useUpdateCourse = (CourseId?: number) => {
  return useWrite<Course>({
    queryKey: ["courses/filtered"],
    url: `/courses/${CourseId}`,
    method: "PUT",
  });
};

export const useDeleteCourse = (CourseId?: number) => {
  return useWrite<{ data: null }>({
    queryKey: ["courses/filtered"],
    url: `/courses/${CourseId}`,
    method: "DELETE",
  });
};
