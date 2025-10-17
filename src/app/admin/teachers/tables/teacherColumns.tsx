import { Column } from "@/components/common/DataTable";
import { capitalize } from "@/lib/helpers";
import { Teacher } from "@/types/api/teacher";

export const teacherColumns: Column<Teacher>[] = [
  { key: "id", label: "ID", className: "" },
  { key: "fullName", label: "Full Name" },
  { key: "phone", label: "Phone" },
  {
    key: "gender",
    label: "Gender",
    render: (teacher: Teacher) => capitalize(teacher.gender),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (teacher: Teacher) =>
      new Date(teacher.createdAt).toLocaleDateString(),
  },
];
