"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/api/student";
import { useDeleteStudent, useGetFilteredStudents } from "@/hooks/useStudent";
import { studentColumns } from "./studentColumns";
import { StudentFormDrawer } from "../forms/studentFormDrawer";
import { StudentDetailDrawer } from "../forms/studentDetailDrawer";

export function StudentTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: studentRes,
    isLoading,
    refetch,
  } = useGetFilteredStudents({
    search,
    page,
    limit,
  });
  const students = studentRes?.data ?? [];
  const total = studentRes?.meta?.pagination?.totalItems ?? students.length;

  const deleteMutation = useDeleteStudent(selectedStudent?.id);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailDrawer(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setShowCreateDrawer(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedStudent) {
      deleteMutation.mutate(selectedStudent.id, {
        onSuccess: () => setShowDeleteModal(false),
      });
    }
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Students</CardTitle>
        <Button
          onClick={() => {
            setSelectedStudent(null);
            setShowCreateDrawer(true);
          }}
        >
          Create Student
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search students"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>

      {/* Drawers */}
      {showCreateDrawer && (
        <StudentFormDrawer
          student={selectedStudent ?? undefined}
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}

      {showDetailDrawer && selectedStudent && (
        <StudentDetailDrawer
          student={selectedStudent}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}

      {showDeleteModal && selectedStudent && (
        <ConfirmationDialog
          title="Delete Student"
          description={`Are you sure you want to delete student "${selectedStudent.fullName}"?`}
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          onConfirm={confirmDelete}
          confirmButtonVariant={"destructive"}
          confirmText="Delete"
        />
      )}
    </Card>
  );
}
