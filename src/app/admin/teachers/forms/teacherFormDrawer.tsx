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
import { Gender } from "@/constants/gender";
import { useEffect } from "react";
import { toast } from "sonner";
import { Teacher } from "@/types/api/teacher";
import { useCreateTeacher, useUpdateTeacher } from "@/hooks/useTeacher";
import { capitalize, handleFormError } from "@/lib/helpers";

interface TeacherFormDrawerProps {
  teacher?: Teacher;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const teacherSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.email("Invalid email"),
  password: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  gender: z.enum(Gender, { error: "Select gender" }),
});

const refinedTeacherSchema = (isEditing: boolean) =>
  teacherSchema.refine(
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

type TeacherFormValues = z.infer<typeof teacherSchema>;

export function TeacherFormDrawer({
  teacher,
  open,
  onOpenChange,
}: TeacherFormDrawerProps) {
  const isEditing = !!teacher;

  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher(teacher?.id);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(refinedTeacherSchema(isEditing)),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      gender: undefined,
    },
  });

  useEffect(() => {
    if (teacher) {
      reset({
        fullName: teacher.fullName,
        email: teacher.user.email,
        password: "",
        phone: teacher.phone,
        address: teacher.address,
        gender: teacher.gender,
      });
    } else {
      reset({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        gender: undefined,
      });
    }
  }, [teacher, reset]);

  const onSubmit = (data: TeacherFormValues) => {
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
      title={isEditing ? "Edit Teacher" : "Create Teacher"}
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
      </div>
    </AppDrawer>
  );
}
