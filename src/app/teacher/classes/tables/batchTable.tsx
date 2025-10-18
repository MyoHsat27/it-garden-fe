"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { Batch } from "@/types/api/batch";
import { useGetFilteredBatches } from "@/hooks/useBatch";
import { batchColumns } from "./batchColumns";
import { BatchDetailDrawer } from "../forms/batchDetailDrawer";
import { useAuth } from "@/hooks/auth/useAuth";

export function BatchTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const { user } = useAuth();

  const teacherId = user?.teacherProfile?.id;

  const {
    data: batchRes,
    isLoading,
    refetch,
  } = useGetFilteredBatches({
    search,
    page,
    limit,
    teacherId,
  });

  const batches = batchRes?.data ?? [];
  const total = batchRes?.meta?.pagination?.totalItems ?? batches.length;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (Batch: Batch) => {
    setSelectedBatch(Batch);
    setShowDetailDrawer(true);
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Batches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search batches"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={batchColumns}
          data={batches}
          isLoading={isLoading}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onView={handleView}
        />
      </CardContent>

      {showDetailDrawer && selectedBatch && (
        <BatchDetailDrawer
          batch={selectedBatch}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}
    </Card>
  );
}
