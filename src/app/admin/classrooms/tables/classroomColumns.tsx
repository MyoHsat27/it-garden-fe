import { Column } from "@/components/common/DataTable";
import { Classroom } from "@/types/api/classroom";

export const classroomColumns: Column<Classroom>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "createdAt",
    label: "Created At",
    render: (classroom: Classroom) =>
      new Date(classroom.createdAt).toLocaleDateString(),
  },
];
