"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/api/role";
import { useDeleteRole, useGetFilteredRoles } from "@/hooks/useRole";
import { roleColumns } from "./roleColumns";
import { RoleFormDrawer } from "../forms/roleFormDrawer";
import { RoleDetailDrawer } from "../forms/roleDetailDrawer";
import { usePermission } from "@/hooks/auth/usePermission";
import { handleFormError } from "@/lib/helpers";

export function RoleTable() {
  const { canPerform } = usePermission();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: RoleRes,
    isLoading,
    refetch,
  } = useGetFilteredRoles({
    search,
    page,
    limit,
  });
  const Roles = RoleRes?.data ?? [];
  const total = RoleRes?.meta?.pagination?.totalItems ?? Roles.length;

  const deleteMutation = useDeleteRole(selectedRole?.id);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleView = (Role: Role) => {
    setSelectedRole(Role);
    setShowDetailDrawer(true);
  };

  const handleEdit = (Role: Role) => {
    setSelectedRole(Role);
    setShowCreateDrawer(true);
  };

  const handleDelete = (Role: Role) => {
    setSelectedRole(Role);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedRole) {
      deleteMutation.mutate(selectedRole.id, {
        onSuccess: () => setShowDeleteModal(false),
        onError: (err) => handleFormError(err),
      });
    }
  };

  return (
    <Card className="py-6 shadow-sm gap-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Roles</CardTitle>
        {canPerform("roles-permissions", "create") && (
          <Button
            onClick={() => {
              setSelectedRole(null);
              setShowCreateDrawer(true);
            }}
          >
            Create Role
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search roles"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={roleColumns}
          data={Roles}
          isLoading={isLoading}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onView={
            canPerform("roles-permissions", "view") ? handleView : undefined
          }
          onEdit={
            canPerform("roles-permissions", "update") ? handleEdit : undefined
          }
          onDelete={
            canPerform("roles-permissions", "delete") ? handleDelete : undefined
          }
        />
      </CardContent>

      {/* Drawers */}
      {showCreateDrawer && (
        <RoleFormDrawer
          role={selectedRole ?? undefined}
          open={showCreateDrawer}
          onOpenChange={setShowCreateDrawer}
        />
      )}

      {showDetailDrawer && selectedRole && (
        <RoleDetailDrawer
          role={selectedRole}
          open={showDetailDrawer}
          onOpenChange={setShowDetailDrawer}
        />
      )}

      {showDeleteModal && selectedRole && (
        <ConfirmationDialog
          title="Delete Role"
          description={`Are you sure you want to delete Role "${selectedRole.name}"?`}
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
