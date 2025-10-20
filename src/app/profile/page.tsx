"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailWarning, User, Lock, CheckCircle } from "lucide-react";

const ProfilePage = () => {
  const user = {
    username: "john_doe",
    email: "john@example.com",
    fullName: "John Doe",
    role: "Student",
    emailVerified: false,
  };

  const [showReset, setShowReset] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // --- Handlers ---
  const handleVerifyEmail = () => {
    console.log("Send verification email");
  };

  const handlePasswordReset = () => {
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password reset:", password);
    setShowReset(false);
    setPassword("");
    setConfirm("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* --- User Info --- */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Full Name:</span> {user.fullName}
            </p>
            <p>
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">Email:</span> {user.email}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {user.emailVerified ? (
                      <CheckCircle
                        className="h-4 w-4 text-green-600 cursor-pointer"
                        onClick={() => alert("Email already verified")}
                      />
                    ) : (
                      <MailWarning
                        className="h-4 w-4 text-yellow-500 cursor-pointer"
                        onClick={handleVerifyEmail}
                      />
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>
                      {user.emailVerified
                        ? "Email verified"
                        : "Email not verified — click to verify"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
          </div>

          {/* --- Password Section --- */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Lock className="h-4 w-4" /> Password
              </h3>
              {!showReset && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReset(true)}
                  >
                    Change Password
                  </Button>
                </div>
              )}
            </div>

            {showReset && (
              <div className="mt-4 space-y-3">
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReset(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handlePasswordReset}>
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
