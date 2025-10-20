"use client";

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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateSubmission } from "@/hooks/useSubmission";
import { StudentAssignment } from "@/types/api/assignment";
import { Textarea } from "@/components/ui/textarea";
import { handleFormError } from "@/lib/helpers";

interface AssignmentFormDialogProps {
  assignment: StudentAssignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const assignmentSchema = z.object({
  content: z.string().optional().nullable(),
  attachment: z.any().refine(
    (file) => {
      if (!file) return true;
      if (file instanceof File) {
        const allowed = [".zip", ".rar", ".7z"];
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
        return allowed.includes(ext);
      }
      return false;
    },
    { message: "Only .zip, .rar, or .7z files are allowed" }
  ),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export function AssignmentFormDialog({
  assignment,
  open,
  onOpenChange,
}: AssignmentFormDialogProps) {
  const createMutation = useCreateSubmission();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: AssignmentFormValues) => {
    const formData = new FormData();
    formData.append("content", String(data.content));
    formData.append("assignmentId", String(assignment.id));
    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }

    createMutation.mutate(formData, {
      onSuccess: () => onOpenChange(false),
      onError: (err) => handleFormError(err),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{"Submit Assignment"}</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-3 mt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Label htmlFor="attachment">Attachment (.zip, .rar, .7z)</Label>
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

          <Label htmlFor="content">Content (Optional)</Label>
          <Textarea
            id="content"
            placeholder="Full Name"
            {...register("content")}
            className={errors.content ? "border-red-500" : ""}
          />
          {errors.content && (
            <span className="text-red-500 text-sm">
              {errors.content.message}
            </span>
          )}
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{"Submit"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
