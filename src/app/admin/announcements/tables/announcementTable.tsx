"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { AnnouncementDetailDrawer } from "../forms/announcementDetailDrawer";
import { announcementColumns } from "./announcementColumns";
import { Payment } from "@/types/api/payment";
import { useGetFilteredAnnouncements } from "@/hooks/useAnnouncement";
import { Announcement } from "@/types/api/announcement";
import { usePermission } from "@/hooks/auth/usePermission";
import { Button } from "@/components/ui/button";
import { AnnouncementFormDrawer } from "../forms/announcementFormDrawer";

export function AnnouncementTable() {
  const { canPerform } = usePermission();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const {
    data: announcementRes,
    isLoading,
    refetch,
  } = useGetFilteredAnnouncements({
    search,
    page,
    limit,
  });
  const announcements = announcementRes?.data ?? [];
  const total =
    announcementRes?.meta?.pagination?.totalItems ?? announcements.length;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailDrawer(true);
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Announcements</CardTitle>
        {canPerform("announcements", "create") && (
          <Button
            onClick={() => {
              setSelectedAnnouncement(null);
              setShowCreateDrawer(true);
            }}
          >
            Create Announcement
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={announcementColumns}
          data={announcements}
          isLoading={isLoading}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          // onView={handleView}
        />
      </CardContent>
      {showCreateDrawer && (
        <AnnouncementFormDrawer
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}
      {showDetailDrawer && selectedAnnouncement && (
        <AnnouncementDetailDrawer
          announcement={selectedAnnouncement}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}
    </Card>
  );
}
