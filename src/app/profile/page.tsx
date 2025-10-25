"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailWarning, User, Lock, CheckCircle } from "lucide-react";
import { axiosApi } from "@/lib/axios";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { handleFormError } from "@/lib/helpers";
import { useAuth } from "@/hooks/auth/useAuth";
import { UserRole, User as UserType } from "@/types/api/user";
import { useAuthStore } from "@/stores/auth.store";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const ProfilePage = () => {
  const { user, role } = useAuth();
  const { setAuth } = useAuthStore();

  let fullName = user?.username;
  if (role === UserRole.ADMIN) fullName = user?.adminProfile?.fullName;
  else if (role === UserRole.STUDENT) fullName = user?.studentProfile?.fullName;
  else if (role === UserRole.TEACHER) fullName = user?.teacherProfile?.fullName;

  const [showReset, setShowReset] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosApi.post("/auth/verify-email");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Verification email sent", {
        description: "Check your inbox to verify your email address.",
      });
      setShowOtpModal(true);
      setTimer(60);
    },
    onError: (err: any) => handleFormError(err),
  });

  const confirmEmailMutation = useMutation({
    mutationFn: async (otp: string) => {
      const res = await axiosApi.post("/auth/confirm-email", { otp });
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Email verified successfully!");
      setShowOtpModal(false);

      const meResponse = await axiosApi.get<{ data: UserType }>("/users/me");
      const newUser = meResponse.data.data;
      const newRole = newUser.userRole.toLowerCase();

      setAuth(newUser, newRole, localStorage.getItem("accessToken") || "");
    },
    onError: (err: any) => handleFormError(err),
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosApi.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully", {
        description: "Your password has been updated.",
      });
      setShowReset(false);
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    },
    onError: (err: any) => handleFormError(err),
  });

  // 🕒 Countdown timer for resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handlePasswordReset = () => {
    if (!oldPassword || !newPassword || !confirm) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword !== confirm) {
      toast.error("Passwords do not match!");
      return;
    }
    changePasswordMutation.mutate();
  };

  const isVerifying = verifyEmailMutation.isPending;
  const isChangingPassword = changePasswordMutation.isPending;
  const isConfirming = confirmEmailMutation.isPending;

  return (
    <>
      <div className="min-h-screen w-full bg-muted/20 flex flex-col p-8">
        <Card className="flex flex-col lg:flex-row w-full h-full shadow-md border rounded-2xl overflow-hidden">
          {/* Left - Profile Info */}
          <div className="w-full lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6 text-primary" /> My Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information and account security.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 mt-4 text-lg">
              <p>
                <span className="font-semibold">Full Name:</span> {fullName}
              </p>
              <p>
                <span className="font-semibold">Username:</span>{" "}
                {user?.username}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">Email:</span> {user?.email}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {user?.isEmailVerified ? (
                        <CheckCircle
                          className="h-5 w-5 text-green-600 cursor-pointer"
                          onClick={() => toast.info("Email already verified")}
                        />
                      ) : (
                        <MailWarning
                          className={`h-5 w-5 text-yellow-500 cursor-pointer ${
                            isVerifying && "opacity-50"
                          }`}
                          onClick={() =>
                            !isVerifying && verifyEmailMutation.mutate()
                          }
                        />
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>
                        {user?.isEmailVerified
                          ? "Email verified"
                          : "Email not verified — click to verify"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
            </CardContent>
          </div>

          {/* Right - Password Settings */}
          <div className="w-full lg:w-1/2 p-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" /> Security Settings
              </CardTitle>
              <CardDescription>
                Change your account password for better security.
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-6">
              {!showReset ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReset(true)}
                >
                  Change Password
                </Button>
              ) : (
                <div className="mt-4 space-y-3">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReset(false)}
                      disabled={isChangingPassword}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handlePasswordReset}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>

      {/* 🔐 OTP Dialog */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code sent to your email.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              onClick={() => confirmEmailMutation.mutate(otp)}
              disabled={otp.length !== 6 || isConfirming}
              className="w-full"
            >
              {isConfirming ? "Verifying..." : "Verify"}
            </Button>

            <p className="text-sm text-muted-foreground">
              Didn’t get the code?{" "}
              <button
                onClick={() => verifyEmailMutation.mutate()}
                disabled={timer > 0}
                className="text-primary underline disabled:opacity-50"
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend code"}
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePage;
