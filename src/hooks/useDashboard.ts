import { useRead, useWrite } from "@/lib/queryClient";

export const useGetAdminDashboard = () => {
  return useRead({
    queryKey: ["dashboard/admin"],
    url: "/dashboard/admin",
  });
};

export const useGetTeacherDashboard = () => {
  return useRead({
    queryKey: ["dashboard/teacher"],
    url: "/dashboard/teacher",
  });
};

export const useGetStudentDashboard = () => {
  return useRead({
    queryKey: ["dashboard/student"],
    url: "/dashboard/student",
  });
};
