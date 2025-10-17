import { useRead, useWrite } from "@/lib/queryClient";
import { Admin } from "@/types/api/admin";
import { PaginatedResponse } from "@/types/api/pagination";

interface AdminFilter {
  search?: string;
  role?: number;
  page?: number;
  limit?: number;
}
export const useGetFilteredAdmins = (filter: AdminFilter) => {
  return useRead<PaginatedResponse<Admin>>({
    queryKey: ["admins/filtered", JSON.stringify(filter)],
    url: "/admins/filtered",
    params: filter,
  });
};

export const useCreateAdmin = () => {
  return useWrite<Admin>({
    queryKey: ["admins/filtered"],
    url: "/admins",
    method: "POST",
  });
};

export const useUpdateAdmin = (adminId?: number) => {
  return useWrite<Admin>({
    queryKey: ["admins/filtered"],
    url: `/admins/${adminId}`,
    method: "PUT",
  });
};

export const useDeleteAdmin = (adminId?: number) => {
  return useWrite<{ data: null }>({
    queryKey: ["admins/filtered"],
    url: `/admins/${adminId}`,
    method: "DELETE",
  });
};
