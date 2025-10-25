"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Classroom } from "@/types/api/classroom";
import {
  useDeleteClassroom,
  useGetFilteredClassrooms,
} from "@/hooks/useClassroom";
import { classroomColumns } from "./classroomColumns";
import { ClassroomFormDialog } from "../forms/classroomFormDialog";
import { ClassroomDetailDrawer } from "../forms/classroomDetailDrawer";
import { usePermission } from "@/hooks/auth/usePermission";
import { handleFormError } from "@/lib/helpers";

export function ClassroomTable() {
  const { canPerform } = usePermission();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: classroomRes, isLoading } = useGetFilteredClassrooms({
    search,
    page,
    limit,
  });
  const classrooms = classroomRes?.data ?? [];
  const total = classroomRes?.meta?.pagination?.totalItems ?? classrooms.length;

  const deleteMutation = useDeleteClassroom(selectedClassroom?.id);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleEdit = (Classroom: Classroom) => {
    setSelectedClassroom(Classroom);
    setShowCreateDrawer(true);
  };

  const handleDelete = (Classroom: Classroom) => {
    setSelectedClassroom(Classroom);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedClassroom) {
      deleteMutation.mutate(selectedClassroom.id, {
        onSuccess: () => setShowDeleteModal(false),
        onError: (err) => handleFormError(err),
      });
    }
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Classrooms</CardTitle>
        {canPerform("classrooms", "create") && (
          <Button
            onClick={() => {
              setSelectedClassroom(null);
              setShowCreateDrawer(true);
            }}
          >
            Create Classroom
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search classrooms"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={classroomColumns}
          data={classrooms}
          isLoading={isLoading}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onEdit={canPerform("classrooms", "update") ? handleEdit : undefined}
          onDelete={
            canPerform("classrooms", "delete") ? handleDelete : undefined
          }
        />
      </CardContent>

      {/* Drawers */}
      {showCreateDrawer && (
        <ClassroomFormDialog
          classroom={selectedClassroom ?? undefined}
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}

      {showDeleteModal && selectedClassroom && (
        <ConfirmationDialog
          title="Delete Classroom"
          description={`Are you sure you want to delete Classroom "${selectedClassroom.name}"?`}
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
