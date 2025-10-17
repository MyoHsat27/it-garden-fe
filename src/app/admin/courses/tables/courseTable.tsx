"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useDeleteCourse, useGetFilteredCourses } from "@/hooks/useCourse";
import { Course } from "@/types/api/course";
import { courseColumns } from "./courseColumns";
import { CourseFormDrawer } from "../forms/courseFormDrawer";
import { CourseDetailDrawer } from "../forms/courseDetailDrawer";

export function CourseTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: courseRes,
    isLoading,
    refetch,
  } = useGetFilteredCourses({
    search,
    page,
    limit,
  });
  const courses = courseRes?.data ?? [];
  const total = courseRes?.meta?.pagination?.totalItems ?? courses.length;

  const deleteMutation = useDeleteCourse(selectedCourse?.id);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (Course: Course) => {
    setSelectedCourse(Course);
    setShowDetailDrawer(true);
  };

  const handleEdit = (Course: Course) => {
    setSelectedCourse(Course);
    setShowCreateDrawer(true);
  };

  const handleDelete = (Course: Course) => {
    setSelectedCourse(Course);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedCourse) {
      deleteMutation.mutate(selectedCourse.id, {
        onSuccess: () => setShowDeleteModal(false),
      });
    }
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Courses</CardTitle>
        <Button
          onClick={() => {
            setSelectedCourse(null);
            setShowCreateDrawer(true);
          }}
        >
          Create Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search Courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={courseColumns}
          data={courses}
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
        <CourseFormDrawer
          course={selectedCourse ?? undefined}
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}

      {showDetailDrawer && selectedCourse && (
        <CourseDetailDrawer
          course={selectedCourse}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}

      {showDeleteModal && selectedCourse && (
        <ConfirmationDialog
          title="Delete Course"
          description={`Are you sure you want to delete Course "${selectedCourse.name}"?`}
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
