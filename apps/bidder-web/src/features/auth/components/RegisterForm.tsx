"use client";

import { useState } from "react";
import { Button, Input, PasswordInput } from "@repo/ui";
import { useRegister } from "../hooks";
import { getApiErrorMessage } from "@/lib/utils";

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptAuctionRules, setAcceptAuctionRules] = useState(false);
  const [acceptAsIsDisclaimer, setAcceptAsIsDisclaimer] = useState(false);
  const register = useRegister();

  const allAccepted =
    acceptTerms && acceptPrivacy && acceptAuctionRules && acceptAsIsDisclaimer;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAccepted) return;
    register.mutate({
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      password,
      acceptTerms,
      acceptPrivacy,
      acceptAuctionRules,
      acceptAsIsDisclaimer,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <Input
        label="Full name"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        autoComplete="name"
      />
      <Input
        label="Mobile number"
        type="tel"
        placeholder="+1234567890"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        required
        autoComplete="tel"
      />
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

      <div className="space-y-2 text-sm">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1"
          />
          <span>I accept the Terms &amp; Conditions</span>
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={acceptPrivacy}
            onChange={(e) => setAcceptPrivacy(e.target.checked)}
            className="mt-1"
          />
          <span>I accept the Privacy Notice</span>
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={acceptAuctionRules}
            onChange={(e) => setAcceptAuctionRules(e.target.checked)}
            className="mt-1"
          />
          <span>I accept the Auction Rules</span>
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={acceptAsIsDisclaimer}
            onChange={(e) => setAcceptAsIsDisclaimer(e.target.checked)}
            className="mt-1"
          />
          <span>I accept the &quot;as-is&quot; disclaimer</span>
        </label>
      </div>

      {register.isError && (
        <p className="text-sm text-red-600">
          {getApiErrorMessage(register.error)}
        </p>
      )}
      <Button
        type="submit"
        fullWidth
        disabled={!allAccepted}
        isLoading={register.isPending}
        className="!bg-blue-600 !text-white hover:!bg-blue-700 focus:ring-blue-500"
      >
        Register
      </Button>
    </form>
  );
}
