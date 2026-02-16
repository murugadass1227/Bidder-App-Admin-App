"use client";

import { useState } from "react";
import { Button, Input, PasswordInput } from "@repo/ui";
import { getApiErrorMessage } from "@/lib/utils";
import { useLogin } from "../hooks";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
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
