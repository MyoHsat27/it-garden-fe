import { Column } from "@/components/common/DataTable";
import { Role } from "@/types/api/role";

export const roleColumns: Column<Role>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "createdAt",
    label: "Created At",
    render: (role: Role) => new Date(role.createdAt).toLocaleDateString(),
  },
];
