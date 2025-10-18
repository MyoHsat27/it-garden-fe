"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { enrollmentColumns } from "./submissionColumns";
import { EnrollmentDetailDrawer } from "../forms/submissionDetailDrawer";
import { Enrollment } from "@/types/api/enrollment";
import { useGetFilteredEnrollments } from "@/hooks/useEnrollment";

export function EnrollmentTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const {
    data: enrollmentRes,
    isLoading,
    refetch,
  } = useGetFilteredEnrollments({
    search,
    page,
    limit,
  });
  const enrollments = enrollmentRes?.data ?? [];
  const total =
    enrollmentRes?.meta?.pagination?.totalItems ?? enrollments.length;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowDetailDrawer(true);
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Enrollment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search enrollments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={enrollmentColumns}
          data={enrollments}
          isLoading={isLoading}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onView={handleView}
        />
      </CardContent>

      {showDetailDrawer && selectedEnrollment && (
        <EnrollmentDetailDrawer
          enrollment={selectedEnrollment}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}
    </Card>
  );
}
