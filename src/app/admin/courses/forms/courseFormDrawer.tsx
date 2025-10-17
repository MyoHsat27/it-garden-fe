import { AppDrawer } from "@/components/common/AppDrawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Course } from "@/types/api/course";
import { useCreateCourse, useUpdateCourse } from "@/hooks/useCourse";
import { Textarea } from "@/components/ui/textarea";
import { handleFormError } from "@/lib/helpers";

interface CourseFormDrawerProps {
  course?: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const courseSchema = z.object({
  name: z.string().min(1, "Title is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export function CourseFormDrawer({
  course,
  open,
  onOpenChange,
}: CourseFormDrawerProps) {
  const isEditing = !!course;

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse(course?.id);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      price: undefined,
    },
  });

  useEffect(() => {
    if (course) {
      reset({
        name: course.name,
        description: course.description,
        duration: course.duration,
        price: course.price,
      });
    } else {
      reset({
        name: "",
        description: "",
        duration: "",
        price: undefined,
      });
    }
  }, [course, reset]);

  const onSubmit = (data: CourseFormValues) => {
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
      title={isEditing ? "Edit course" : "Create course"}
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
        <Label htmlFor="name"> Title</Label>
        <Input
          id="name"
          placeholder="Title"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}

        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          placeholder="e.g., 8 weeks"
          {...register("duration")}
          className={errors.duration ? "border-red-500" : ""}
        />
        {errors.duration && (
          <span className="text-red-500 text-sm">
            {errors.duration.message}
          </span>
        )}

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

        <Label htmlFor="price">Price (MMK)</Label>
        <Input
          id="price"
          placeholder="Price (MMK)"
          type="number"
          {...register("price")}
          className={errors.price ? "border-red-500" : ""}
        />
        {errors.price && (
          <span className="text-red-500 text-sm">{errors.price.message}</span>
        )}
      </div>
    </AppDrawer>
  );
}
