"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { courseColumns } from "./courseColumns";
import { CourseDetailDrawer } from "../forms/courseDetailDrawer";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetFilteredBatches } from "@/hooks/useBatch";
import { Batch } from "@/types/api/batch";

export function CourseTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedCourse, setSelectedCourse] = useState<Batch | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const { user } = useAuth();

  const studentId = user?.studentProfile?.id;

  const { data: courseRes, isLoading } = useGetFilteredBatches({
    studentId,
    search,
    page,
    limit,
  });
  const courses = courseRes?.data ?? [];
  const total = courseRes?.meta?.pagination?.totalItems ?? courses.length;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (batch: Batch) => {
    setSelectedCourse(batch);
    setShowDetailDrawer(true);
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Enrolled Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search courses"
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
        />
      </CardContent>

      {/* Drawers */}
      {showDetailDrawer && selectedCourse && (
        <CourseDetailDrawer
          batch={selectedCourse}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}
    </Card>
  );
}
