"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  useDeleteTimeSlot,
  useGetFilteredTimeSlots,
} from "@/hooks/useTimeSlot";
import { TimeSlot } from "@/types/api/timeSlot";
import { timeSlotColumns } from "./timeSlotColumns";
import { TimeSlotFormDialog } from "../forms/timeSlotFormDialog";
import { TimeSlotDetailDrawer } from "../forms/timeSlotDetailDrawer";

export function TimeSlotTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: timeSlotsRes,
    isLoading,
    refetch,
  } = useGetFilteredTimeSlots({
    search,
    page,
    limit,
  });
  const timeSlots = timeSlotsRes?.data ?? [];
  const total = timeSlotsRes?.meta?.pagination?.totalItems ?? timeSlots.length;

  const deleteMutation = useDeleteTimeSlot(selectedTimeSlot?.id);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setShowDetailDrawer(true);
  };

  const handleEdit = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setShowCreateDrawer(true);
  };

  const handleDelete = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedTimeSlot) {
      deleteMutation.mutate(selectedTimeSlot.id, {
        onSuccess: () => setShowDeleteModal(false),
      });
    }
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Time slots</CardTitle>
        <Button
          onClick={() => {
            setSelectedTimeSlot(null);
            setShowCreateDrawer(true);
          }}
        >
          Create Time Slot
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search time slots"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={timeSlotColumns}
          data={timeSlots}
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

      {showCreateDrawer && (
        <TimeSlotFormDialog
          timeSlot={selectedTimeSlot ?? undefined}
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}

      {showDetailDrawer && selectedTimeSlot && (
        <TimeSlotDetailDrawer
          timeSlot={selectedTimeSlot}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}

      {showDeleteModal && selectedTimeSlot && (
        <ConfirmationDialog
          title="Delete time slot"
          description={`Are you sure you want to delete time slot "${selectedTimeSlot.name}"?`}
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
