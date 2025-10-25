"use client";

import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { handleFormError } from "@/lib/helpers";
import { useGetAllBatches } from "@/hooks/useBatch";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { format } from "date-fns";
import { CalendarDatePicker } from "@/components/common/CalendarDatePicker";
import { Assignment } from "@/types/api/assignment";
import {
  useCreateAssignment,
  useUpdateAssignment,
} from "@/hooks/useAssignment";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AssignmentFormDrawerProps {
  assignment?: Assignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const assignmentSchema = z
  .object({
    batchId: z
      .number({
        error: () => "Select batch",
      })
      .min(1, "Select batch"),
    startDate: z.string().min(1, "Start date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    attachment: z
      .any()
      .refine(
        (file) => {
          if (!file) return true;
          if (file instanceof File) {
            const allowed = [".zip", ".rar", ".7z"];
            const ext = file.name
              .toLowerCase()
              .slice(file.name.lastIndexOf("."));
            return allowed.includes(ext);
          }
          return false;
        },
        { message: "Only .zip, .rar, or .7z files are allowed" }
      )
      .optional(),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(data.startDate);
      return start >= today;
    },
    {
      message: "Start date cannot be in the past",
      path: ["startDate"],
    }
  );

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export function AssignmentFormDrawer({
  assignment,
  open,
  onOpenChange,
}: AssignmentFormDrawerProps) {
  const isEditing = !!assignment;

  const { data: batchesRes } = useGetAllBatches();

  const { mutate: createMutation, isPending: isCreatePending } =
    useCreateAssignment();
  const { mutate: updateMutation, isPending: isUpdatePending } =
    useUpdateAssignment(assignment?.id);

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "Test",
      description: "Test",
      batchId: undefined,
      startDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  useEffect(() => {
    if (assignment) {
      reset({
        title: assignment.title,
        description: assignment.description,
        batchId: assignment.batch?.id ?? 0,
        startDate: format(new Date(assignment.startDate), "yyyy-MM-dd"),
        dueDate: format(new Date(assignment.dueDate), "yyyy-MM-dd"),
      });
    } else {
      reset({
        title: "Test",
        description: "Test",
        batchId: undefined,
        startDate: format(new Date(), "yyyy-MM-dd"),
        dueDate: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [assignment, reset]);

  const onSubmit = (data: AssignmentFormValues) => {
    const formData = new FormData();
    formData.append("batchId", String(data.batchId));
    formData.append("startDate", data.startDate);
    formData.append("dueDate", data.dueDate);
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }

    const mutation = isEditing ? updateMutation : createMutation;

    mutation(formData, {
      onSuccess: () => onOpenChange(false),
      onError: (err: any) => handleFormError(err),
    });
  };

  return (
    <AppDrawer
      size={"lg"}
      open={open}
      title={isEditing ? "Edit Assignment" : "Create Assignment"}
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
          <Label>Batch</Label>
          <Controller
            control={control}
            name="batchId"
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={
                  batchesRes?.data?.map((b) => ({
                    id: b.id,
                    label: `${b.name} - ${b.course.name}`,
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
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Title"
            {...register("title")}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description"
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <span className="text-red-500 text-sm">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <CalendarDatePicker
                label="Start Date"
                value={field.value}
                onChange={field.onChange}
                error={errors.startDate?.message}
                disabledBeforeToday
                isDisabled={isEditing}
              />
            )}
          />
          {errors.startDate && (
            <span className="text-red-500 text-sm">
              {errors.startDate.message}
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
          <Label htmlFor="attachment">Attachment (optional)</Label>
          <Controller
            control={control}
            name="attachment"
            render={({ field }) => (
              <Input
                id="attachment"
                type="file"
                accept=".zip,.rar,.7z"
                onChange={(e) => field.onChange(e.target.files?.[0])}
                className={errors.attachment ? "border-red-500" : ""}
              />
            )}
          />
          {errors.attachment && (
            <span className="text-red-500 text-sm">
              {errors.attachment.message?.toString()}
            </span>
          )}
        </div>
      </div>
    </AppDrawer>
  );
}
