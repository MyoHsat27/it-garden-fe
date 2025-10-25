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
import { useAuthStore } from "@/stores/auth.store";
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
import { User, UserRole } from "@/types/api/user";
import { handleFormError } from "@/lib/helpers";

const loginSchema = z.object({
  login: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "hsatmyo@gmail.com", password: "yngWIE500" },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const res = await axiosApi.post("/auth/login", values);
      return res.data;
    },
    onSuccess: async (data) => {
      const accessToken = data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      const meResponse = await axiosApi.get<{ data: User }>("/users/me", {
        headers: { Authorization: `Bearer ${data.data.accessToken}` },
      });

      const user = meResponse.data.data;
      const role = user.userRole.toLowerCase();
      setAuth(user, role, accessToken);

      let fullName = "";

      if (user.userRole === UserRole.ADMIN)
        fullName = user.adminProfile?.fullName ?? user.username;
      else if (user.userRole === UserRole.STUDENT)
        fullName = user.studentProfile?.fullName ?? user.username;
      else if (user.userRole === UserRole.TEACHER)
        fullName = user.teacherProfile?.fullName ?? user.username;

      toast.success("Login Successful", {
        description: `Welcome back, ${fullName}!`,
      });

      router.push(`/${role}`);
    },
    onError: (err: any) => handleFormError(err),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-[400px]">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">Login</h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                loginMutation.mutate(values)
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full mt-2"
                type="submit"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => router.push("/auth/forgot-password")}
          >
            Forgot password?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
