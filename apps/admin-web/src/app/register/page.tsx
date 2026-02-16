"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, PasswordInput, Card, CardHeader, CardContent } from "@repo/ui";
import axios from "axios";

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
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader title="Create admin account" />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <Input
              label="Name (optional)"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="!bg-blue-600 !text-white hover:!bg-blue-700 focus:ring-blue-500"
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
