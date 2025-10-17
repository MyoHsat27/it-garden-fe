"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, Controller, Form } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useGetAllRoles } from "@/hooks/useRole";
import { useWrite } from "@/lib/queryClient";
import { Admin } from "@/types/api/admin";
import { Gender } from "@/constants/gender";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AdminFormDialogProps {
  admin?: Admin;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const adminSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  gender: z.enum(Gender, { error: "Select gender" }),
  roleId: z
    .number({
      error: () => "Select role",
    })
    .min(1, "Select role"),
});

type AdminFormValues = z.infer<typeof adminSchema>;

export function AdminFormDialog({
  admin,
  open,
  onOpenChange,
}: AdminFormDialogProps) {
  const { data: rolesRes } = useGetAllRoles();
  const roles = rolesRes?.data ?? [];

  const createMutation = useWrite({ url: "/admins", method: "POST" });
  const updateMutation = useWrite({
    url: `/admins/${admin?.id}`,
    method: "PUT",
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
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
    if (admin) {
      updateMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
    } else {
      createMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{admin ? "Edit Admin" : "Create Admin"}</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-3 mt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
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

          <Label htmlFor="email">Full Name</Label>
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

          <Label htmlFor="password">Full Name</Label>
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

          <Label htmlFor="phone">Full Name</Label>
          <Input
            id="phone"
            placeholder="Phone"
            {...register("phone")}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}

          <Label htmlFor="address">Full Name</Label>
          <Input
            id="address"
            placeholder="Address"
            {...register("address")}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <span className="text-red-500 text-sm">
              {errors.address.message}
            </span>
          )}

          <div className="flex flex-col">
            <Label htmlFor="gender">Gender</Label>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select {...field}>
                  <SelectTrigger>
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
              <span className="text-red-500 text-sm">
                {errors.gender.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="role">Role</Label>
            <Controller
              control={control}
              name="roleId"
              render={({ field }) => (
                <Select
                  value={field.value !== undefined ? String(field.value) : ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id.toString()}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.roleId && (
              <span className="text-red-500 text-sm">
                {errors.roleId.message}
              </span>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{admin ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
