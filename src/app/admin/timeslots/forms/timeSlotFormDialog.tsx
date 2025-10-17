"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { handleFormError } from "@/lib/helpers";
import { TimeSlot } from "@/types/api/timeSlot";
import { useCreateTimeSlot, useUpdateTimeSlot } from "@/hooks/useTimeSlot";
import {
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface TimeSlotFormDialogProps {
  timeSlot?: TimeSlot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dayOfWeek: z
    .number()
    .min(0, "Day must be between 0 and 6")
    .max(6, "Day must be between 0 and 6"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

type TimeSlotFormValues = z.infer<typeof timeSlotSchema>;

const days = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export function TimeSlotFormDialog({
  timeSlot,
  open,
  onOpenChange,
}: TimeSlotFormDialogProps) {
  const isEditing = !!timeSlot;

  const { mutate: createMutation, isPending: isCreatePending } =
    useCreateTimeSlot();
  const { mutate: updateMutation, isPending: isUpdatePending } =
    useUpdateTimeSlot(timeSlot?.id);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TimeSlotFormValues>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      name: "",
      dayOfWeek: 0,
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    if (timeSlot) {
      reset({
        name: timeSlot.name,
        dayOfWeek: timeSlot.dayOfWeek,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
      });
    } else {
      reset({
        name: "",
        dayOfWeek: 0,
        startTime: "",
        endTime: "",
      });
    }
  }, [timeSlot, reset]);

  const onSubmit = (data: TimeSlotFormValues) => {
    if (isEditing) {
      updateMutation(data, {
        onSuccess: () => onOpenChange(false),
        onError: (err: any) => handleFormError(err),
      });
    } else {
      createMutation(data, {
        onSuccess: () => onOpenChange(false),
        onError: (err: any) => handleFormError(err),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Time Slot" : "Create Time Slot"}
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-3 mt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="dayOfWeek">Day of Week</Label>
            <Controller
              name="dayOfWeek"
              control={control}
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((d) => (
                      <SelectItem key={d.value} value={String(d.value)}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.dayOfWeek && (
              <span className="text-red-500 text-sm">
                {errors.dayOfWeek.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              {...register("startTime")}
              className={errors.startTime ? "border-red-500" : ""}
            />
            {errors.startTime && (
              <span className="text-red-500 text-sm">
                {errors.startTime.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              {...register("endTime")}
              className={errors.endTime ? "border-red-500" : ""}
            />
            {errors.endTime && (
              <span className="text-red-500 text-sm">
                {errors.endTime.message}
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
            <Button disabled={isCreatePending || isUpdatePending} type="submit">
              {isEditing
                ? isUpdatePending
                  ? "Updating"
                  : "Update"
                : isCreatePending
                ? "Creating"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
