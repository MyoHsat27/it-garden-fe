import { useRead } from "@/lib/queryClient";
import { Permission } from "@/types/api/role";

export const useGetAllPermissions = () => {
  return useRead<{ data: Permission[] }>({
    queryKey: ["permissions"],
    url: "/permissions",
  });
};
