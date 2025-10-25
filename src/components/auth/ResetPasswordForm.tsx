"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { axiosApi } from "@/lib/axios";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("rt");

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (values: ResetPasswordValues) => {
      const payload = {
        newPassword: values.newPassword,
        resetToken: resetToken,
      };
      const res = await axiosApi.post("/auth/reset-password", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset successful", {
        description: "You can now log in with your new password.",
      });
      setTimeout(() => router.push("/auth/login"), 2500);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to reset password. Try again."
      );
    },
  });

  if (!resetToken) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted">
        <Card className="w-[400px] text-center p-6">
          <h2 className="text-xl font-semibold mb-2">
            Invalid or Missing Token
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            The reset token is missing or expired. Please request a new one.
          </p>
          <Button onClick={() => router.push("/auth/forgot-password")}>
            Request New Reset Link
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-[400px]">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
          <p className="text-sm text-center text-muted-foreground mt-1">
            Enter your new password below.
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                resetPasswordMutation.mutate(values)
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                        disabled={resetPasswordMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter new password"
                        {...field}
                        disabled={resetPasswordMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full mt-2"
                type="submit"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending
                  ? "Resetting..."
                  : "Reset Password"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => router.push("/auth/login")}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
