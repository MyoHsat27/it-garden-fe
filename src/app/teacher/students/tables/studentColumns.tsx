import { Column } from "@/components/common/DataTable";
import { capitalize } from "@/lib/helpers";
import { Student } from "@/types/api/student";

export const studentColumns: Column<Student>[] = [
  { key: "id", label: "ID" },
  {
    key: "registrationNumber",
    label: "Registration No.",
    render: (student: Student) => student.registrationNumber,
  },
  { key: "fullName", label: "Full Name" },
  { key: "phone", label: "Phone" },
  {
    key: "gender",
    label: "Gender",
    render: (student: Student) => capitalize(student.gender),
  },
  {
    key: "createdAt",
    label: "Joined At",
    render: (student: Student) =>
      new Date(student.createdAt).toLocaleDateString(),
  },
];
