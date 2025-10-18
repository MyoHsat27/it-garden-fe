"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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

interface TimeSlotFormDialogProps {
  timeSlot?: TimeSlot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlotSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine(
    (data) => {
      const [startH, startM] = data.startTime.split(":").map(Number);
      const [endH, endM] = data.endTime.split(":").map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (startMinutes >= endMinutes) return false;

      return endMinutes - startMinutes <= 360;
    },
    {
      message:
        "Start time must be before end time and duration cannot exceed 6 hours",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      const [startH] = data.startTime.split(":").map(Number);
      const [endH] = data.endTime.split(":").map(Number);

      return startH >= 8 && endH <= 18;
    },
    {
      message: "Time slots must be between 08:00 AM and 06:00 PM",
      path: ["startTime"],
    }
  );

type TimeSlotFormValues = z.infer<typeof timeSlotSchema>;

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
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    if (timeSlot) {
      reset({
        name: timeSlot.name,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
      });
    } else {
      reset({
        name: "",
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

          {/* <div className="flex flex-col gap-3">
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
          </div> */}

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
