"use client";

import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { getSpotsLeftMessage, handleFormError } from "@/lib/helpers";
import {
  Enrollment,
  PaymentMethod,
  PaymentStatus,
} from "@/types/api/enrollment";
import {
  useCreateEnrollment,
  useUpdateEnrollment,
} from "@/hooks/useEnrollment";
import { useGetAllBatches } from "@/hooks/useBatch";
import { useGetAllStudents } from "@/hooks/useStudent";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarDatePicker } from "@/components/common/CalendarDatePicker";

interface EnrollmentFormDrawerProps {
  enrollment?: Enrollment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const enrollmentSchema = z
  .object({
    studentId: z
      .number({
        error: () => "Select student",
      })
      .min(1, "Select student"),
    batchId: z
      .number({
        error: () => "Select batch",
      })
      .min(1, "Select batch"),
    feeStatus: z.enum(PaymentStatus, {
      error: "Select payment status",
    }),
    paymentMethod: z
      .enum(PaymentMethod, { error: "Select payment method" })
      .optional()
      .nullable(),
    feeAmount: z.coerce.number().min(1, "Fee amount must be at least 1"),
    discountAmount: z.coerce.number().min(0, "Discount cannot be negative"),
    finalFee: z.coerce.number().min(0, "Final fee cannot be negative"),
    dueDate: z.string().min(1, "Due date is required"),
  })
  .refine((data) => data.discountAmount <= data.feeAmount, {
    message: "Discount cannot be greater than fee amount",
    path: ["discountAmount"],
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(data.dueDate);
      return due >= today;
    },
    {
      message: "Due date cannot be in the past",
      path: ["dueDate"],
    }
  )
  .refine(
    (data) => data.feeStatus !== PaymentStatus.PAID || !!data.paymentMethod,
    {
      message: "Payment method is required when status is PAID",
      path: ["paymentMethod"],
    }
  );

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

export function EnrollmentFormDrawer({
  enrollment,
  open,
  onOpenChange,
}: EnrollmentFormDrawerProps) {
  const isEditing = !!enrollment;
  const [baseFee, setBaseFee] = useState<number>(0);

  const { data: studentsRes } = useGetAllStudents();
  const { data: batchesRes } = useGetAllBatches();

  const { mutate: createMutation, isPending: isCreatePending } =
    useCreateEnrollment();
  const { mutate: updateMutation, isPending: isUpdatePending } =
    useUpdateEnrollment(enrollment?.id);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: undefined,
      batchId: undefined,
      feeAmount: 0,
      discountAmount: 0,
      finalFee: 0,
      feeStatus: PaymentStatus.PENDING,
      dueDate: format(new Date(), "yyyy-MM-dd"),
      paymentMethod: undefined,
    },
  });

  const discount = watch("discountAmount");
  const feeAmount = watch("feeAmount");
  const feeStatus = watch("feeStatus");
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (feeStatus !== PaymentStatus.PAID && paymentMethod) {
      setValue("paymentMethod", undefined);
    }
  }, [feeStatus, paymentMethod, setValue]);

  useEffect(() => {
    const final = Number(feeAmount || 0) - Number(discount || 0);
    setValue("finalFee", final);
  }, [discount, feeAmount, setValue]);

  const handleBatchChange = (batchId: number) => {
    const batch = batchesRes?.data?.find((b) => b.id === batchId);
    const price = batch?.course?.price ?? 0;
    setBaseFee(price);
    setValue("feeAmount", price);
  };

  useEffect(() => {
    if (enrollment) {
      reset({
        studentId: enrollment.student?.id ?? 0,
        batchId: enrollment.batch?.id ?? 0,
        feeStatus: enrollment.feeStatus,
        feeAmount: Number(enrollment.feeAmount),
        discountAmount: Number(enrollment.discountAmount),
        finalFee: Number(enrollment.finalFee),
        dueDate: format(new Date(enrollment.dueDate), "yyyy-MM-dd"),
        paymentMethod: enrollment.paymentMethod ?? undefined,
      });
    } else {
      reset({
        studentId: undefined,
        batchId: undefined,
        feeAmount: 0,
        discountAmount: 0,
        finalFee: 0,
        feeStatus: PaymentStatus.PENDING,
        dueDate: format(new Date(), "yyyy-MM-dd"),
        paymentMethod: undefined,
      });
    }
  }, [enrollment, reset]);

  const onSubmit = (data: EnrollmentFormValues) => {
    const mutation = isEditing ? updateMutation : createMutation;

    if (data.feeStatus !== PaymentStatus.PAID) {
      delete (data as any).paymentMethod;
    }

    mutation(data, {
      onSuccess: () => onOpenChange(false),
      onError: (err: any) => handleFormError(err),
    });
  };

  return (
    <AppDrawer
      size={"lg"}
      open={open}
      title={isEditing ? "Edit Enrollment" : "Create Enrollment"}
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
        <div className="flex flex-col gap-2">
          <Label>Student</Label>
          <Controller
            control={control}
            name="studentId"
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={
                  studentsRes?.data?.map((s) => ({
                    id: s.id,
                    label: `${s.fullName} - ${s.registrationNumber}`,
                  })) ?? []
                }
                placeholder="Select student"
                searchPlaceholder="Search student"
                emptyMessage="No student found."
                allowUnselect={false}
              />
            )}
          />
          {errors.studentId && (
            <span className="text-red-500 text-sm">
              {errors.studentId.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Batch</Label>
          <Controller
            control={control}
            name="batchId"
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  handleBatchChange(Number(value));
                }}
                options={
                  batchesRes?.data?.map((b) => ({
                    id: b.id,
                    disabled: b.spotsLeft === 0,
                    label: `${b.name} - ${
                      b.course.name
                    } - ${getSpotsLeftMessage(b.spotsLeft)}`,
                  })) ?? []
                }
                placeholder="Select batch"
                searchPlaceholder="Search batch"
                emptyMessage="No batch found."
                allowUnselect={false}
              />
            )}
          />
          {errors.batchId && (
            <span className="text-red-500 text-sm">
              {errors.batchId.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Fee Amount</Label>
          <Input
            type="number"
            {...register("feeAmount")}
            disabled
            className={errors.feeAmount ? "border-red-500" : ""}
          />
          {errors.feeAmount && (
            <span className="text-red-500 text-sm">
              {errors.feeAmount.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Discount</Label>
          <Input
            type="number"
            {...register("discountAmount")}
            className={errors.discountAmount ? "border-red-500" : ""}
          />
          {errors.discountAmount && (
            <span className="text-red-500 text-sm">
              {errors.discountAmount.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Final Fee</Label>
          <Input
            type="number"
            {...register("finalFee")}
            disabled
            className={errors.finalFee ? "border-red-500" : ""}
          />
          {errors.finalFee && (
            <span className="text-red-500 text-sm">
              {errors.finalFee.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <CalendarDatePicker
                label="Due Date"
                value={field.value}
                onChange={field.onChange}
                error={errors.dueDate?.message}
                disabledBeforeToday
                isDisabled={isEditing}
              />
            )}
          />
          {errors.dueDate && (
            <span className="text-red-500 text-sm">
              {errors.dueDate.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Payment Status</Label>
          <Controller
            control={control}
            name="feeStatus"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.feeStatus && (
            <span className="text-red-500 text-sm">
              {errors.feeStatus.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Payment Method</Label>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value ?? undefined}
                disabled={watch("feeStatus") !== PaymentStatus.PAID}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                  <SelectItem value={PaymentMethod.WAVE}>Wave</SelectItem>
                  <SelectItem value={PaymentMethod.KPAY}>KPay</SelectItem>
                  <SelectItem value={PaymentMethod.AYA_PAY}>AYA Pay</SelectItem>
                  <SelectItem value={PaymentMethod.KBZ_SAVING}>
                    KBZ (Saving)
                  </SelectItem>
                  <SelectItem value={PaymentMethod.AYA_SAVING}>
                    AYA (Saving)
                  </SelectItem>
                  <SelectItem value={PaymentMethod.FOC}>FOC</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.paymentMethod && (
            <span className="text-red-500 text-sm">
              {errors.paymentMethod.message}
            </span>
          )}
        </div>
      </div>
    </AppDrawer>
  );
}
