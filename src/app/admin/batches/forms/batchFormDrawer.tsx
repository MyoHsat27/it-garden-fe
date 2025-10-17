"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Batch } from "@/types/api/batch";
import { useCreateBatch, useUpdateBatch } from "@/hooks/useBatch";
import { handleFormError } from "@/lib/helpers";
import { useGetAllCourses } from "@/hooks/useCourse";
import { useGetAllTeachers } from "@/hooks/useTeacher";
import { SearchableSelect } from "@/components/common/SearchableSelect";

interface BatchFormDrawerProps {
  batch?: Batch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BatchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  courseId: z.number(),
  teacherId: z.number(),
});

type BatchFormValues = z.infer<typeof BatchSchema>;

export function BatchFormDrawer({
  batch,
  open,
  onOpenChange,
}: BatchFormDrawerProps) {
  const isEditing = !!batch;

  const createMutation = useCreateBatch();
  const updateMutation = useUpdateBatch(batch?.id);

  const { data: coursesRes } = useGetAllCourses();
  const { data: teachersRes } = useGetAllTeachers();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BatchFormValues>({
    resolver: zodResolver(BatchSchema),
    defaultValues: {
      name: "",
      description: "",
      courseId: undefined,
      teacherId: undefined,
    },
  });

  useEffect(() => {
    if (batch) {
      reset({
        name: batch.name,
        description: batch.description,
        courseId: batch.course.id,
        teacherId: batch.teacher.id,
      });
    } else {
      reset({
        name: "",
        description: "",
        courseId: undefined,
        teacherId: undefined,
      });
    }
  }, [batch, reset]);

  const onSubmit = (data: BatchFormValues) => {
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
      title={isEditing ? "Edit Batch" : "Create Batch"}
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Batch Name"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
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
          <Label>Course</Label>
          <Controller
            control={control}
            name="courseId"
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={
                  coursesRes?.data?.map((c) => ({
                    id: c.id,
                    label: c.name,
                  })) ?? []
                }
                placeholder="Select course..."
                searchPlaceholder="Search course..."
                emptyMessage="No course found."
                allowUnselect={false}
              />
            )}
          />
          {errors.courseId && (
            <span className="text-red-500 text-sm">
              {errors.courseId.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Teacher</Label>
          <Controller
            control={control}
            name="teacherId"
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={
                  teachersRes?.data?.map((t) => ({
                    id: t.id,
                    label: t.fullName,
                  })) ?? []
                }
                placeholder="Select teacher..."
                searchPlaceholder="Search teacher..."
                emptyMessage="No teacher found."
                allowUnselect={false}
              />
            )}
          />
          {errors.teacherId && (
            <span className="text-red-500 text-sm">
              {errors.teacherId.message}
            </span>
          )}
        </div>
      </div>
    </AppDrawer>
  );
}
