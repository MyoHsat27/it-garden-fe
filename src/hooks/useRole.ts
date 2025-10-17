import { useRead, useWrite } from "@/lib/queryClient";
import { PaginatedResponse } from "@/types/api/pagination";
import { Role } from "@/types/api/role";

interface RoleFilter {
  search?: string;
  role?: number;
  page?: number;
  limit?: number;
}
export const useGetAllRoles = () => {
  return useRead<{ data: Role[] }>({
    queryKey: ["roles"],
    url: "/roles",
  });
};

export const useGetFilteredRoles = (filter: RoleFilter) => {
  return useRead<PaginatedResponse<Role>>({
    queryKey: ["/roles/filtered", JSON.stringify(filter)],
    url: "/roles/filtered",
    params: filter,
  });
};

export const useCreateRole = () => {
  return useWrite<Role>({
    queryKey: ["roles/filtered"],
    url: "/roles",
    method: "POST",
  });
};

export const useUpdateRole = (roleId?: number) => {
  return useWrite<Role>({
    queryKey: ["roles/filtered"],
    url: `/roles/${roleId}`,
    method: "PUT",
  });
};

export const useDeleteRole = (roleId?: number) => {
  return useWrite<{ data: null }>({
    queryKey: ["roles/filtered"],
    url: `/roles/${roleId}`,
    method: "DELETE",
  });
};
