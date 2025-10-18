"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Batch } from "@/types/api/batch";
import { useCreateBatch, useUpdateBatch } from "@/hooks/useBatch";
import { formatTimeAMPM, handleFormError } from "@/lib/helpers";
import { useGetAllCourses } from "@/hooks/useCourse";
import { useGetAllTeachers } from "@/hooks/useTeacher";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { useGetAllClassrooms } from "@/hooks/useClassroom";
import { useGetAllTimeSlots } from "@/hooks/useTimeSlot";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarDatePicker } from "@/components/common/CalendarDatePicker";

interface BatchFormDrawerProps {
  batch?: Batch;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TimetableSchema = z.object({
  dayOfWeek: z.number().min(0).max(6, "Day must be between 0-6"),
  timeSlotId: z.number({ error: "Time Slot is required" }),
});

const BatchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  courseId: z.number({ error: "Course is required" }),
  teacherId: z.number({ error: "Teacher is required" }),
  classroomId: z.number({ error: "Classroom is required" }),
  timetables: z
    .array(TimetableSchema)
    .min(1, "At least one timetable is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type BatchFormValues = z.infer<typeof BatchSchema>;

export function BatchFormDrawer({
  batch,
  open,
  onOpenChange,
}: BatchFormDrawerProps) {
  const isEditing = !!batch;

  const { mutate: createMutation, isPending: isCreatePending } =
    useCreateBatch();
  const { mutate: updateMutation, isPending: isUpdatePending } = useUpdateBatch(
    batch?.id
  );

  const { data: classroomsRes } = useGetAllClassrooms();
  const { data: coursesRes } = useGetAllCourses();
  const { data: teachersRes } = useGetAllTeachers();
  const { data: timeSlots } = useGetAllTimeSlots();

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
      classroomId: undefined,
      timetables: [],
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "timetables",
  });

  useEffect(() => {
    if (batch) {
      reset({
        name: batch.name,
        description: batch.description,
        courseId: batch.course.id,
        teacherId: batch.teacher.id,
        classroomId: batch.classroom.id,
        startDate: format(new Date(batch.startDate), "yyyy-MM-dd"),
        endDate: format(new Date(batch.endDate), "yyyy-MM-dd"),
      });
    } else {
      reset({
        name: "",
        description: "",
        courseId: undefined,
        teacherId: undefined,
        classroomId: undefined,
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [batch, reset]);

  const onSubmit = (data: BatchFormValues) => {
    const mutate = isEditing ? updateMutation : createMutation;
    mutate(data, {
      onSuccess: () => onOpenChange(false),
      onError: (err: any) => handleFormError(err),
    });
  };

  return (
    <AppDrawer
      open={open}
      title={isEditing ? "Edit Batch" : "Create Batch"}
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isEditing
              ? isUpdatePending
                ? "Updating"
                : "Update"
              : isCreatePending
              ? "Creating"
              : "Create"}
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
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <CalendarDatePicker
                label="Start Date"
                value={field.value}
                onChange={field.onChange}
                error={errors.startDate?.message}
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
            name="endDate"
            render={({ field }) => (
              <CalendarDatePicker
                label="End Date"
                value={field.value}
                onChange={field.onChange}
                error={errors.endDate?.message}
                isDisabled={isEditing}
              />
            )}
          />
          {errors.endDate && (
            <span className="text-red-500 text-sm">
              {errors.endDate.message}
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
                placeholder="Select course"
                searchPlaceholder="Search course"
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
                placeholder="Select teacher"
                searchPlaceholder="Search teacher"
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

        <div className="flex flex-col gap-2">
          <Label>Classroom</Label>
          <Controller
            control={control}
            name="classroomId"
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={
                  classroomsRes?.data?.map((t) => ({
                    id: t.id,
                    label: `${t.name} - Max ${t.capacity} `,
                  })) ?? []
                }
                placeholder="Select classroom"
                searchPlaceholder="Search classroom"
                emptyMessage="No classroom found."
                allowUnselect={false}
              />
            )}
          />
          {errors.classroomId && (
            <span className="text-red-500 text-sm">
              {errors.classroomId.message}
            </span>
          )}
        </div>

        <div className="flex flex-col pb-8 gap-4">
          <div className="flex items-center justify-between">
            <Label>Timetables {fields.length + " class/week"}</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                append({ dayOfWeek: 1, timeSlotId: undefined as any })
              }
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="p-4 flex flex-col gap-3 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-red-500"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="flex flex-col gap-3">
                <Label>Day of Week</Label>
                <Controller
                  control={control}
                  name={`timetables.${index}.dayOfWeek`}
                  render={({ field }) => (
                    <SearchableSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { id: 0, label: "Sunday" },
                        { id: 1, label: "Monday" },
                        { id: 2, label: "Tuesday" },
                        { id: 3, label: "Wednesday" },
                        { id: 4, label: "Thursday" },
                        { id: 5, label: "Friday" },
                        { id: 6, label: "Saturday" },
                      ]}
                      placeholder="Select day"
                      searchPlaceholder="Search day"
                      emptyMessage="No day found."
                      allowUnselect={false}
                    />
                  )}
                />

                {errors.timetables?.[index]?.dayOfWeek && (
                  <span className="text-red-500 text-sm">
                    {errors.timetables[index]?.dayOfWeek?.message as string}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label>Time Slot</Label>
                <Controller
                  control={control}
                  name={`timetables.${index}.timeSlotId`}
                  render={({ field }) => (
                    <SearchableSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={
                        timeSlots?.data?.map((t) => ({
                          id: t.id,
                          label: `${formatTimeAMPM(
                            t.startTime
                          )} - ${formatTimeAMPM(t.endTime)}`,
                        })) ?? []
                      }
                      placeholder="Select timeslot"
                      searchPlaceholder="Search timeslot"
                      emptyMessage="No timeslot found."
                      allowUnselect={false}
                    />
                  )}
                />

                {errors.timetables?.[index]?.timeSlotId && (
                  <span className="text-red-500 text-sm">
                    {errors.timetables[index]?.timeSlotId?.message as string}
                  </span>
                )}
              </div>
            </Card>
          ))}

          {errors.timetables && (
            <span className="text-red-500 text-sm">
              {errors.timetables.message as string}
            </span>
          )}
        </div>
      </div>
    </AppDrawer>
  );
}
