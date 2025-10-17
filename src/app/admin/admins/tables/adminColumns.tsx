import { Column } from "@/components/common/DataTable";
import { capitalize } from "@/lib/helpers";
import { Admin } from "@/types/api/admin";

export const adminColumns: Column<Admin>[] = [
  { key: "id", label: "ID", className: "" },
  { key: "fullName", label: "Full Name" },
  { key: "phone", label: "Phone" },
  {
    key: "role",
    label: "Role",
    render: (admin: Admin) => admin.role?.name ?? "-",
  },
  {
    key: "gender",
    label: "Gender",
    render: (admin: Admin) => capitalize(admin.gender),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (admin: Admin) => new Date(admin.createdAt).toLocaleDateString(),
  },
];
