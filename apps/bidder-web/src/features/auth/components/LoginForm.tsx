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
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
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
      {login.isError && (
        <p className="text-sm text-red-600">
          {getApiErrorMessage(login.error)}
        </p>
      )}
      <Button type="submit" fullWidth isLoading={login.isPending}>
        Log in
      </Button>
    </form>
  );
}
