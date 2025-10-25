"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { useEffect, useState } from "react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(0); // seconds remaining

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (values: ForgotPasswordValues) => {
      const res = await axiosApi.post("/auth/forgot-password", values);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password Reset Link Sent", {
        description: "Check your email inbox for the password reset link.",
      });
      // start 60-second countdown
      setCountdown(60);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    },
  });

  // ⏳ countdown effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const isSending = forgotPasswordMutation.isPending;
  const isCooldown = countdown > 0;

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-[400px]">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">
            Forgot Password
          </h2>
          <p className="text-sm text-center text-muted-foreground mt-1">
            Enter your email to receive a password reset link.
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                forgotPasswordMutation.mutate(values)
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        disabled={isSending || isCooldown}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full mt-2"
                type="submit"
                disabled={isSending || isCooldown}
              >
                {isSending
                  ? "Sending..."
                  : isCooldown
                  ? `Resend in ${countdown}s`
                  : "Send Reset Link"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => router.push("/auth/login")}
            disabled={isSending}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
