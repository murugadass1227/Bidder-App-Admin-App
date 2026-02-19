"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  PasswordInput,
  Card,
  CardHeader,
  CardContent,
} from "@repo/ui";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : "http://localhost:4000/api/v1";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(API_URL + "/auth/login", {
        emailOrMobile: email,
        password,
      });

      if (data.user?.role !== "ADMIN") {
        setError("Admin access required");
        return;
      }

      login(data.accessToken, data.refreshToken, data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Botswana Insurance Company
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Auction Management System
          </p>
        </div>

        {/* Card */}
        <Card className="shadow-2xl border border-gray-100 rounded-2xl backdrop-blur-xl bg-white/90">
          <CardHeader
            title="Admin Login 🔐"
            subtitle="Sign in to access the admin dashboard"
            className="pb-2"
          />

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="h-12"
              />

              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-12"
              />

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Button */}
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                className="h-12 text-base font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an admin account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition"
            >
              Request Access
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
