"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { enrollmentColumns } from "./assignmentColumns";
import { Assignment, StudentAssignment } from "@/types/api/assignment";
import { useGetFilteredStudentAssignments } from "@/hooks/useAssignment";
import { AssignmentDetailDrawer } from "../forms/assignmentDetailDrawer";
import { useAuth } from "@/hooks/auth/useAuth";
import { AssignmentFormDialog } from "../forms/assignmentFormDialog";
import { Button } from "@/components/ui/button";
import { Notebook } from "lucide-react";

export function AssignmentTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { user } = useAuth();
  const studentId = user?.studentProfile?.id;

  const [selectedAssignment, setSelectedAssignment] =
    useState<StudentAssignment | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const { data: assignmentRes, isLoading } = useGetFilteredStudentAssignments({
    studentId,
    search,
    page,
    limit,
  });
  const assignments = assignmentRes?.data ?? [];
  const total =
    assignmentRes?.meta?.pagination?.totalItems ?? assignments.length;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (assignment: StudentAssignment) => {
    setSelectedAssignment(assignment);
    setShowDetailDrawer(true);
  };
  const handleSubmit = (assignment: StudentAssignment) => {
    setSelectedAssignment(assignment);
    setShowCreateDrawer(true);
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Assignment</CardTitle>
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
          renderActions={(assignment: StudentAssignment) =>
            !assignment.submission && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSubmit(assignment)}
              >
                <Notebook />
              </Button>
            )
          }
        />
      </CardContent>

      {/* Drawers */}
      {showCreateDrawer && selectedAssignment && (
        <AssignmentFormDialog
          assignment={selectedAssignment}
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
