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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Classroom } from "@/types/api/classroom";
import { useCreateClassroom, useUpdateClassroom } from "@/hooks/useClassroom";
import { handleFormError } from "@/lib/helpers";

interface ClassroomFormDialogProps {
  classroom?: Classroom;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const adminSchema = z.object({
  name: z.string().min(1, "Room Name is required"),
});

type ClassroomFormValues = z.infer<typeof adminSchema>;

export function ClassroomFormDialog({
  classroom,
  open,
  onOpenChange,
}: ClassroomFormDialogProps) {
  const isEditing = !!classroom;

  const { mutate: createMutation, isPending: isCreatePending } =
    useCreateClassroom();
  const { mutate: updateMutation, isPending: isUpdatePending } =
    useUpdateClassroom(classroom?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassroomFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (classroom) {
      reset({
        name: classroom.name,
      });
    } else {
      reset({
        name: "",
      });
    }
  }, [classroom, reset]);

  const onSubmit = (data: ClassroomFormValues) => {
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
            {isEditing ? "Edit Classroom" : "Create Classroom"}
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-3 mt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Label htmlFor="name">Room Name</Label>
          <Input
            id="name"
            placeholder="Room Name"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}

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
