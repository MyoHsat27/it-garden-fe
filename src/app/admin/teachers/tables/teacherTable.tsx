"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { teacherColumns } from "./teacherColumns";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Teacher } from "@/types/api/teacher";
import { useDeleteTeacher, useGetFilteredTeachers } from "@/hooks/useTeacher";
import { Button } from "@/components/ui/button";
import { TeacherFormDrawer } from "../forms/teacherFormDrawer";
import { TeacherDetailDrawer } from "../forms/teacherDetailDrawer";
import { usePermission } from "@/hooks/auth/usePermission";
import { handleFormError } from "@/lib/helpers";

export function TeacherTable() {
  const { canPerform } = usePermission();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: teacherRes, isLoading } = useGetFilteredTeachers({
    search,
    page,
    limit,
  });
  const teachers = teacherRes?.data ?? [];
  const total = teacherRes?.meta?.pagination?.totalItems ?? teachers.length;

  const deleteMutation = useDeleteTeacher(selectedTeacher?.id);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailDrawer(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowCreateDrawer(true);
  };

  const handleDelete = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedTeacher) {
      deleteMutation.mutate(selectedTeacher.id, {
        onSuccess: () => setShowDeleteModal(false),
        onError: (err) => handleFormError(err),
      });
    }
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Teachers</CardTitle>
        {canPerform("teachers", "create") && (
          <Button
            onClick={() => {
              setSelectedTeacher(null);
              setShowCreateDrawer(true);
            }}
          >
            Create Teacher
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search teachers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={teacherColumns}
          data={teachers}
          isLoading={isLoading}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onView={canPerform("teachers", "view") ? handleView : undefined}
          onEdit={canPerform("teachers", "update") ? handleEdit : undefined}
          onDelete={canPerform("teachers", "delete") ? handleDelete : undefined}
        />
      </CardContent>

      {/* Drawers */}
      {showCreateDrawer && (
        <TeacherFormDrawer
          teacher={selectedTeacher ?? undefined}
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}

      {showDetailDrawer && selectedTeacher && (
        <TeacherDetailDrawer
          teacher={selectedTeacher}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}

      {showDeleteModal && selectedTeacher && (
        <ConfirmationDialog
          title="Delete Teacher"
          description={`Are you sure you want to delete teacher "${selectedTeacher.fullName}"?`}
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
