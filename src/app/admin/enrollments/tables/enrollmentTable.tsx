"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { enrollmentColumns } from "./enrollmentColumns";
import { EnrollmentFormDrawer } from "../forms/enrollmentFormDrawer";
import { EnrollmentDetailDrawer } from "../forms/enrollmentDetailDrawer";
import { Enrollment, PaymentStatus } from "@/types/api/enrollment";
import { useGetFilteredEnrollments } from "@/hooks/useEnrollment";
import { EnrollmentPaidFormDialog } from "../forms/enrollmentPaidFormDialog";
import { BanknoteArrowUp } from "lucide-react";
import { usePermission } from "@/hooks/auth/usePermission";

export function EnrollmentTable() {
  const { canPerform } = usePermission();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
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

  const handlePayment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowPaymentDrawer(true);
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Enrollment</CardTitle>
        {canPerform("enrollments", "create") && (
          <Button
            onClick={() => {
              setSelectedEnrollment(null);
              setShowCreateDrawer(true);
            }}
          >
            Add Enrollment
          </Button>
        )}
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
          onView={canPerform("enrollments", "view") ? handleView : undefined}
          renderActions={(enrollment: Enrollment) => {
            if (canPerform("enrollments", "add-payment")) {
              return (
                enrollment.feeStatus !== PaymentStatus.PAID && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600"
                    onClick={() => handlePayment(enrollment)}
                  >
                    <BanknoteArrowUp />
                  </Button>
                )
              );
            }
          }}
        />
      </CardContent>

      {/* Drawers */}
      {showCreateDrawer && (
        <EnrollmentFormDrawer
          enrollment={selectedEnrollment ?? undefined}
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}
      {showPaymentDrawer && (
        <EnrollmentPaidFormDialog
          enrollment={selectedEnrollment as Enrollment}
          open={showPaymentDrawer}
          onOpenChange={setShowPaymentDrawer}
        />
      )}

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
