"use client";

import { useState } from "react";
import { Button, Input, PasswordInput } from "@repo/ui";
import { useRegister } from "../hooks";
import { getApiErrorMessage } from "@/lib/utils";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ email, password, name: name.trim() || undefined });
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
      {register.isError && (
        <p className="text-sm text-red-600">
          {getApiErrorMessage(register.error)}
        </p>
      )}
      <Button
        type="submit"
        fullWidth
        isLoading={register.isPending}
        className="!bg-blue-600 !text-white hover:!bg-blue-700 focus:ring-blue-500"
      >
        Register
      </Button>
    </form>
  );
}
