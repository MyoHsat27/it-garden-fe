import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetAllRoles } from "@/hooks/useRole";
import { Admin } from "@/types/api/admin";
import { Gender } from "@/constants/gender";
import { useEffect } from "react";
import { useCreateAdmin, useUpdateAdmin } from "@/hooks/useAdmin";
import { handleFormError } from "@/lib/helpers";
import { SearchableSelect } from "@/components/common/SearchableSelect";

interface AdminFormDrawerProps {
  admin?: Admin;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const adminSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.email("Invalid email"),
  password: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  gender: z.enum(Gender, { error: "Select gender" }),
  roleId: z
    .number({
      error: () => "Select role",
    })
    .min(1, "Select role"),
});

const refinedAdminSchema = (isEditing: boolean) =>
  adminSchema.refine(
    (data) => {
      if (!isEditing) {
        return data.password && data.password.length >= 6;
      }
      return true;
    },
    {
      message: "Password must be at least 6 characters",
      path: ["password"],
    }
  );

type AdminFormValues = z.infer<typeof adminSchema>;

export function AdminFormDrawer({
  admin,
  open,
  onOpenChange,
}: AdminFormDrawerProps) {
  const isEditing = !!admin;
  const { data: rolesRes } = useGetAllRoles();
  const roles = rolesRes?.data ?? [];

  const createMutation = useCreateAdmin();
  const updateMutation = useUpdateAdmin(admin?.id);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(refinedAdminSchema(isEditing)),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      gender: undefined,
      roleId: undefined,
    },
  });

  useEffect(() => {
    if (admin) {
      reset({
        fullName: admin.fullName,
        email: admin.user.email,
        password: "",
        phone: admin.phone,
        address: admin.address,
        gender: admin.gender,
        roleId: admin.role?.id,
      });
    } else {
      reset({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        gender: undefined,
        roleId: undefined,
      });
    }
  }, [admin, reset]);

  const onSubmit = (data: AdminFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
        onError: (err: any) => handleFormError(err),
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
        onError: (err: any) => handleFormError(err),
      });
    }
  };

  return (
    <AppDrawer
      open={open}
      title={isEditing ? "Edit Admin" : "Create Admin"}
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
      <div className="flex flex-col gap-3">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Full Name"
          {...register("fullName")}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <span className="text-red-500 text-sm">
            {errors.fullName.message}
          </span>
        )}

        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Email"
          type="email"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}

        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="Password"
          type="password"
          {...register("password")}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}

        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          placeholder="Phone"
          {...register("phone")}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <span className="text-red-500 text-sm">{errors.phone.message}</span>
        )}

        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Address"
          {...register("address")}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <span className="text-red-500 text-sm">{errors.address.message}</span>
        )}

        <Label htmlFor="gender">Gender</Label>
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Gender.MALE}>Male</SelectItem>
                <SelectItem value={Gender.FEMALE}>Female</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && (
          <span className="text-red-500 text-sm">{errors.gender.message}</span>
        )}

        <Label htmlFor="role">Role</Label>
        <Controller
          control={control}
          name="roleId"
          render={({ field }) => (
            <SearchableSelect
              value={field.value}
              onChange={field.onChange}
              options={
                rolesRes?.data?.map((r) => ({
                  id: r.id,
                  label: r.name,
                })) ?? []
              }
              placeholder="Select role..."
              searchPlaceholder="Search role..."
              emptyMessage="No role found."
              allowUnselect={false}
            />
          )}
        />
        {errors.roleId && (
          <span className="text-red-500 text-sm">{errors.roleId.message}</span>
        )}
      </div>
    </AppDrawer>
  );
}
