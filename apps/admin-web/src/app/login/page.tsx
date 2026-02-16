"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, PasswordInput, Card, CardHeader, CardContent } from "@repo/ui";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : "http://localhost:4000/api/v1";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(API_URL + "/auth/login", {
        email,
        password,
      });
      if (data.user?.role !== "ADMIN") {
        setError("Admin access required");
        return;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      window.location.href = "/dashboard";
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
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader title="Admin login" />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="!bg-blue-600 !text-white hover:!bg-blue-700 focus:ring-blue-500"
            >
              Log in
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-4 text-sm text-gray-600">
        No account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Create admin account
        </Link>
      </p>
    </main>
  );
}
