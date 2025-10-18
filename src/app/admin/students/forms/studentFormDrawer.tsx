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
import { Student, StudentStatus } from "@/types/api/student";
import { useCreateStudent, useUpdateStudent } from "@/hooks/useStudent";
import { capitalize, handleFormError } from "@/lib/helpers";

interface StudentFormDrawerProps {
  student?: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const studentSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.email("Invalid email"),
  password: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  guardianName: z.string().min(1, "Guardian Name is required"),
  guardianContact: z.string().min(1, "Guardian Contact is required"),
  gender: z.enum(Gender, { error: "Select gender" }),
  status: z.enum(StudentStatus, { error: "Select student status" }),
});

const refinedStudentSchema = (isEditing: boolean) =>
  studentSchema.refine(
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

type StudentFormValues = z.infer<typeof studentSchema>;

export function StudentFormDrawer({
  student,
  open,
  onOpenChange,
}: StudentFormDrawerProps) {
  const isEditing = !!student;

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent(student?.id);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(refinedStudentSchema(isEditing)),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      guardianName: "",
      guardianContact: "",
      gender: undefined,
      status: StudentStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName,
        email: student.user.email,
        password: "",
        phone: student.phone,
        address: student.address,
        guardianName: student.guardianName,
        guardianContact: student.guardianContact,
        gender: student.gender,
        status: student.status,
      });
    } else {
      reset({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        guardianName: "",
        guardianContact: "",
        gender: undefined,
        status: StudentStatus.ACTIVE,
      });
    }
  }, [student, reset]);

  const onSubmit = (data: StudentFormValues) => {
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
      title={isEditing ? "Edit student" : "Create student"}
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

        <Label htmlFor="name">Guardian Name</Label>
        <Input
          id="guardianName"
          placeholder="Guardian Name"
          {...register("guardianName")}
          className={errors.guardianName ? "border-red-500" : ""}
        />
        {errors.guardianName && (
          <span className="text-red-500 text-sm">
            {errors.guardianName.message}
          </span>
        )}

        <Label htmlFor="guardianContact">Guardian Contact</Label>
        <Input
          id="guardianContact"
          placeholder="Guardian Contact"
          {...register("guardianContact")}
          className={errors.guardianContact ? "border-red-500" : ""}
        />
        {errors.guardianContact && (
          <span className="text-red-500 text-sm">
            {errors.guardianContact.message}
          </span>
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

        <Label htmlFor="status">Student Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={StudentStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={StudentStatus.COMPLETED}>
                  Completed
                </SelectItem>
                <SelectItem value={StudentStatus.DROPPED_OUT}>
                  Dropped Out
                </SelectItem>
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
