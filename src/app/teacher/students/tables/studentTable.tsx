"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { Student } from "@/types/api/student";
import { useGetFilteredStudents } from "@/hooks/useStudent";
import { studentColumns } from "./studentColumns";
import { StudentDetailDrawer } from "../forms/studentDetailDrawer";
import { useAuth } from "@/hooks/auth/useAuth";

export function StudentTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const { user } = useAuth();

  const teacherId = user?.teacherProfile?.id;

  const { data: studentRes, isLoading } = useGetFilteredStudents({
    search,
    page,
    limit,
    teacherId,
  });
  const students = studentRes?.data ?? [];
  const total = studentRes?.meta?.pagination?.totalItems ?? students.length;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailDrawer(true);
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">My Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search by name or registration no"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-70"
            />
          </div>
        </div>

        <DataTable
          columns={studentColumns}
          data={students}
          isLoading={isLoading}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onView={handleView}
        />
      </CardContent>

      {showDetailDrawer && selectedStudent && (
        <StudentDetailDrawer
          student={selectedStudent}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}
    </Card>
  );
}
