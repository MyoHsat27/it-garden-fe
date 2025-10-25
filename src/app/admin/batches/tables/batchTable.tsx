"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Batch } from "@/types/api/batch";
import { useDeleteBatch, useGetFilteredBatches } from "@/hooks/useBatch";
import { batchColumns } from "./batchColumns";
import { BatchFormDrawer } from "../forms/batchFormDrawer";
import { BatchDetailDrawer } from "../forms/batchDetailDrawer";
import { usePermission } from "@/hooks/auth/usePermission";
import { handleFormError } from "@/lib/helpers";

export function BatchTable() {
  const { canPerform } = usePermission();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: batchRes,
    isLoading,
    refetch,
  } = useGetFilteredBatches({
    search,
    page,
    limit,
  });
  const batches = batchRes?.data ?? [];
  const total = batchRes?.meta?.pagination?.totalItems ?? batches.length;

  const deleteMutation = useDeleteBatch(selectedBatch?.id);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (Batch: Batch) => {
    setSelectedBatch(Batch);
    setShowDetailDrawer(true);
  };

  // const handleEdit = (Batch: Batch) => {
  //   setSelectedBatch(Batch);
  //   setShowCreateDrawer(true);
  // };

  const handleDelete = (Batch: Batch) => {
    setSelectedBatch(Batch);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedBatch) {
      deleteMutation.mutate(selectedBatch.id, {
        onSuccess: () => setShowDeleteModal(false),
        onError: (err) => handleFormError(err),
      });
    }
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Batches</CardTitle>
        {canPerform("batches", "create") && (
          <Button
            onClick={() => {
              setSelectedBatch(null);
              setShowCreateDrawer(true);
            }}
          >
            Create Batch
          </Button>
        )}
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
          onView={canPerform("batches", "view") ? handleView : undefined}
          // onEdit={canPerform("batches", "update") ? handleEdit : undefined}
          onDelete={canPerform("batches", "delete") ? handleDelete : undefined}
        />
      </CardContent>

      {/* Drawers */}
      {showCreateDrawer && (
        <BatchFormDrawer
          batch={selectedBatch ?? undefined}
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}

      {showDetailDrawer && selectedBatch && (
        <BatchDetailDrawer
          batch={selectedBatch}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}

      {showDeleteModal && selectedBatch && (
        <ConfirmationDialog
          title="Delete Batch"
          description={`Are you sure you want to delete Batch "${selectedBatch.name}"?`}
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
