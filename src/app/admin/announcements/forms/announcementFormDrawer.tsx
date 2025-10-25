"use client";

import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { handleFormError } from "@/lib/helpers";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { NotificationChannel } from "@/types/api/announcement";
import { useGetAllBatches } from "@/hooks/useBatch";
import { useCreateAnnouncement } from "@/hooks/useAnnouncement";

interface AnnouncementFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  batchId: z.number().nullable().optional(),
  channels: z
    .array(z.nativeEnum(NotificationChannel))
    .default([NotificationChannel.WEB]),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export function AnnouncementFormDrawer({
  open,
  onOpenChange,
}: AnnouncementFormDrawerProps) {
  const { data: batchesRes } = useGetAllBatches();
  const { mutate: createAnnouncement, isPending } = useCreateAnnouncement();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      body: "",
      batchId: undefined,
      channels: [NotificationChannel.WEB],
    },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = (data: AnnouncementFormValues) => {
    createAnnouncement(data, {
      onSuccess: () => onOpenChange(false),
      onError: (err: any) => handleFormError(err),
    });
  };

  const channelOptions = Object.values(NotificationChannel);

  return (
    <AppDrawer
      size="lg"
      open={open}
      title="Create Announcement"
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || isPending}
          >
            Create
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <Label>Title</Label>
          <Input
            {...register("title")}
            placeholder="Enter announcement title"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-2">
          <Label>Body</Label>
          <Textarea
            {...register("body")}
            rows={4}
            placeholder="Write your announcement message..."
            className={errors.body ? "border-red-500" : ""}
          />
          {errors.body && (
            <span className="text-red-500 text-sm">{errors.body.message}</span>
          )}
        </div>

        {/* Batch (optional) */}
        <div className="flex flex-col gap-2">
          <Label>Batch (optional)</Label>
          <Controller
            control={control}
            name="batchId"
            render={({ field }) => (
              <SearchableSelect
                value={field.value ?? undefined}
                onChange={(value) => field.onChange(Number(value))}
                options={
                  batchesRes?.data?.map((b) => ({
                    id: b.id,
                    label: b.name,
                  })) ?? []
                }
                placeholder="Select batch"
                searchPlaceholder="Search batch"
                emptyMessage="No batch found."
                allowUnselect
              />
            )}
          />
          {errors.batchId && (
            <span className="text-red-500 text-sm">
              {errors.batchId.message}
            </span>
          )}
        </div>

        {/* Channels */}
        <div className="flex flex-col gap-2">
          <Label>Notification Channels</Label>
          <div className="flex flex-col gap-2">
            {channelOptions.map((ch) => (
              <Controller
                key={ch}
                control={control}
                name="channels"
                render={({ field }) => {
                  const isChecked = field.value?.includes(ch);
                  return (
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...(field.value ?? []), ch]);
                          } else {
                            field.onChange(
                              field.value?.filter((c) => c !== ch)
                            );
                          }
                        }}
                      />
                      <span>{ch}</span>
                    </label>
                  );
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AppDrawer>
  );
}
