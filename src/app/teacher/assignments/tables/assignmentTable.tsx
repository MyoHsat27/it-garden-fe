"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { enrollmentColumns } from "./assignmentColumns";
import { Assignment } from "@/types/api/assignment";
import { useGetFilteredAssignments } from "@/hooks/useAssignment";
import { AssignmentFormDrawer } from "../forms/assignmentFormDrawer";
import { AssignmentDetailDrawer } from "../forms/assignmentDetailDrawer";
import { useAuth } from "@/hooks/auth/useAuth";

export function AssignmentTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { user } = useAuth();
  const teacherId = user?.teacherProfile?.id;

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const { data: assignmentRes, isLoading } = useGetFilteredAssignments({
    search,
    page,
    limit,
    teacherId,
  });
  const assignments = assignmentRes?.data ?? [];
  const total =
    assignmentRes?.meta?.pagination?.totalItems ?? assignments.length;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailDrawer(true);
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Assignment</CardTitle>
        <Button
          onClick={() => {
            setSelectedAssignment(null);
            setShowCreateDrawer(true);
          }}
        >
          Create Assignment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search assignments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={enrollmentColumns}
          data={assignments}
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
      {showCreateDrawer && (
        <AssignmentFormDrawer
          assignment={selectedAssignment ?? undefined}
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}
      {showDetailDrawer && selectedAssignment && (
        <AssignmentDetailDrawer
          assignment={selectedAssignment}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}
    </Card>
  );
}
