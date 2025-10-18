import { Column } from "@/components/common/DataTable";
import { Classroom } from "@/types/api/classroom";
import { User } from "lucide-react";

export const classroomColumns: Column<Classroom>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "capacity",
    label: "Capacity",
    render: (classroom: Classroom) => (
      <span className="flex items-center gap-1">
        <User width={17} height={17} />
        {classroom.capacity}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (classroom: Classroom) =>
      new Date(classroom.createdAt).toLocaleDateString(),
  },
];
