"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, PasswordInput, Card, CardHeader, CardContent } from "@repo/ui";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : "http://localhost:4000/api/v1";

function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    const msg = err.response.data.message;
    return Array.isArray(msg) ? msg.join(" ") : String(msg);
  }
  if (axios.isAxiosError(err) && err.response?.status === 409) {
    return "Email already registered.";
  }
  if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
    return "Cannot reach the server. Make sure the API is running.";
  }
  return "Registration failed.";
}

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await axios.post(API_URL + "/auth/register", {
        email,
        password,
        name: name.trim() || undefined,
        role: "ADMIN",
      });
      if (data.user?.role !== "ADMIN") {
        setError("Admin account could not be created.");
        return;
      }
      
      // Use auth context to login
      login(data.accessToken, data.refreshToken, data.user);
      
      // Navigate to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Botswana Insurance Company (BIC)
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Create Your Admin Account
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader 
            title="Create Admin Account" 
            subtitle="Register for access to the auction management system"
          />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                className="h-12"
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="h-12"
              />
              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                minLength={6}
                autoComplete="new-password"
                className="h-12"
              />
              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={6}
                autoComplete="new-password"
                className="h-12"
              />
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                className="h-12 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 text-base font-medium"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an admin account?{" "}
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
