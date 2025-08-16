import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ForgotPassword = () => {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
    } catch (error) {
      // Toast messages are already handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-examify-blue hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <div className="text-center text-sm mb-4">
          <Link to="/login" className="text-examify-blue hover:underline">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
