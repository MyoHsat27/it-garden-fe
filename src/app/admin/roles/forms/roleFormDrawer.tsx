import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Permission, Role } from "@/types/api/role";
import { useCreateRole, useUpdateRole } from "@/hooks/useRole";
import { capitalize } from "@/lib/helpers";
import { useGetAllPermissions } from "@/hooks/usePermission";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RoleFormDrawerProps {
  role?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  permissionIds: z
    .array(z.number())
    .min(1, "Please select at least one permission"),
});

type RoleFormValues = z.infer<typeof RoleSchema>;

export function RoleFormDrawer({
  role,
  open,
  onOpenChange,
}: RoleFormDrawerProps) {
  const isEditing = !!role;

  const { data: permissionsResponse, isLoading: isLoadingPermissions } =
    useGetAllPermissions();
  const permissions = permissionsResponse?.data ?? [];

  const allPermissionIds = useMemo(
    () => permissions.map((p) => p.id),
    [permissions]
  );

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = permissions.reduce(
      (acc, permission) => {
        const { subject } = permission;
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push(permission);
        return acc;
      },
      {} as Record<string, Permission[]>
    );

    for (const subject in groups) {
      groups[subject].sort((a, b) => a.action.localeCompare(b.action));
    }

    return groups;
  }, [permissions]);

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole(role?.id);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: "",
      permissionIds: [],
    },
  });

  const selectedPermissionIds = watch("permissionIds");
  const areAllSelected =
    allPermissionIds.length > 0 &&
    selectedPermissionIds.length === allPermissionIds.length;

  const handleSelectAllToggle = () => {
    if (areAllSelected) {
      setValue("permissionIds", []);
    } else {
      setValue("permissionIds", allPermissionIds, { shouldValidate: true });
    }
  };

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        permissionIds: role.permissions?.map((p) => p.id) ?? [],
      });
    } else {
      reset({
        name: "",
        permissionIds: [],
      });
    }
  }, [role, reset]);

  const onSubmit = (data: RoleFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
        onError: (err: any) => {
          const message = err?.response?.data?.error?.message;
          let errorMessage = "Something went wrong";
          if (Array.isArray(message) && message.length > 0) {
            errorMessage = message[0];
          } else if (typeof message === "string") {
            errorMessage = message;
          }
          toast.error(capitalize(errorMessage));
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
        onError: (err: any) => {
          const message = err?.response?.data?.error?.message;
          let errorMessage = "Something went wrong";
          if (Array.isArray(message) && message.length > 0) {
            errorMessage = message[0];
          } else if (typeof message === "string") {
            errorMessage = message;
          }
          toast.error(capitalize(errorMessage));
        },
      });
    }
  };

  return (
    <AppDrawer
      open={open}
      title={isEditing ? "Edit Role" : "Create Role"}
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isEditing ? "Update" : "Create"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Role Name</Label>
          <Input
            id="name"
            placeholder="e.g., Finance Manager"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Label>Permissions</Label>
            {!isLoadingPermissions && permissions.length > 0 && (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="p-0 h-auto"
                onClick={handleSelectAllToggle}
              >
                {areAllSelected ? "Deselect All" : "Select All"}
              </Button>
            )}
          </div>

          {isLoadingPermissions ? (
            <p className="text-sm text-gray-500">Loading permissions...</p>
          ) : (
            <ScrollArea className="h-72 w-full rounded-md border p-4">
              <Controller
                name="permissionIds"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    {Object.keys(groupedPermissions)
                      .sort()
                      .map((subject) => (
                        <div key={subject} className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-800 border-b pb-1">
                            {capitalize(subject)}
                          </h4>
                          {groupedPermissions[subject].map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center gap-2 pl-2"
                            >
                              <Checkbox
                                id={permission.id.toString()}
                                checked={field.value?.includes(permission.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        permission.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (id) => id !== permission.id
                                        )
                                      );
                                }}
                              />
                              <Label
                                htmlFor={permission.id.toString()}
                                className="font-normal cursor-pointer"
                              >
                                {capitalize(permission.action)}
                              </Label>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              />
            </ScrollArea>
          )}
          {errors.permissionIds && (
            <span className="text-red-500 text-sm">
              {errors.permissionIds.message}
            </span>
          )}
        </div>
      </div>
    </AppDrawer>
  );
}
