"use client";

import { useState } from "react";
import { useGetAllRoles } from "@/hooks/useRole";
import { useGetFilteredAdmins, useDeleteAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { DataTable } from "@/components/common/DataTable";
import { adminColumns } from "./adminColumns";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Admin } from "@/types/api/admin";
import { Button } from "@/components/ui/button";
import { AdminFormDrawer } from "../forms/adminFormDrawer";
import { AdminDetailDrawer } from "../forms/adminDetailDrawer";

export function AdminTable() {
  const [search, setSearch] = useState("");
  const [role, setRoleId] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: adminRes,
    isLoading,
    refetch,
  } = useGetFilteredAdmins({
    search,
    role,
    page,
    limit,
  });
  const { data: rolesRes } = useGetAllRoles();
  const admins = adminRes?.data ?? [];
  const total = adminRes?.meta?.pagination?.totalItems ?? admins.length;
  const roles = rolesRes?.data ?? [];

  const deleteMutation = useDeleteAdmin(selectedAdmin?.id);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowDetailDrawer(true);
  };

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowCreateDrawer(true);
  };

  const handleDelete = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedAdmin) {
      deleteMutation.mutate(selectedAdmin.id, {
        onSuccess: () => setShowDeleteModal(false),
      });
    }
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Admins</CardTitle>
        <Button
          onClick={() => {
            setSelectedAdmin(null);
            setShowCreateDrawer(true);
          }}
        >
          Create Admin
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search admins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select
              onValueChange={(value) =>
                setRoleId(value === "all" ? undefined : parseInt(value))
              }
              value={role?.toString() ?? "all"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={adminColumns}
          data={admins}
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

      {/* Drawers */}
      {showCreateDrawer && (
        <AdminFormDrawer
          admin={selectedAdmin ?? undefined}
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}

      {showDetailDrawer && selectedAdmin && (
        <AdminDetailDrawer
          admin={selectedAdmin}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}

      {showDeleteModal && selectedAdmin && (
        <ConfirmationDialog
          title="Delete Admin"
          description={`Are you sure you want to delete admin "${selectedAdmin.fullName}"?`}
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
