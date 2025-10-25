"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { PaymentDetailDrawer } from "../forms/paymentDetailDrawer";
import { paymentColumns } from "./paymentColumns";
import { Payment } from "@/types/api/payment";
import { useGetFilteredPayments } from "@/hooks/usePayment";

export function PaymentTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const {
    data: paymentRes,
    isLoading,
    refetch,
  } = useGetFilteredPayments({
    search,
    page,
    limit,
  });
  const payments = paymentRes?.data ?? [];
  const total = paymentRes?.meta?.pagination?.totalItems ?? payments.length;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailDrawer(true);
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search payments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={paymentColumns}
          data={payments}
          isLoading={isLoading}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onView={handleView}
        />
      </CardContent>

      {showDetailDrawer && selectedPayment && (
        <PaymentDetailDrawer
          payment={selectedPayment}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}
    </Card>
  );
}
