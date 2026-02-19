"use client";

import { useState } from "react";
import { Button, Input, PasswordInput } from "@repo/ui";
import { getApiErrorMessage } from "@/lib/utils";
import { useLogin } from "../hooks";

export function LoginForm() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ emailOrMobile: emailOrMobile.trim(), password });
  };

  return (
    <div className="w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-gray-100">
          
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome Back 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Login to continue to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <Input
              label="Email or mobile number"
              type="text"
              placeholder="you@example.com or +1234567890"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              required
              autoComplete="username"
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {/* Error Message */}
            {login.isError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {getApiErrorMessage(login.error)}
              </p>
            )}

            {/* Button */}
            <Button
              type="submit"
              fullWidth
              isLoading={login.isPending}
              className="h-11 text-base font-semibold rounded-xl"
            >
              Log in
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Secure login powered by your platform
          </p>
        </div>
      </div>
    </div>
  );
}
