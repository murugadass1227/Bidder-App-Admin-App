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
    <div className="w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-gray-100">

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Create Account 🚀
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Register to start bidding and participating in auctions
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

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

            {/* Agreements Section */}
            <div className="space-y-3 text-sm bg-gray-50 border border-gray-200 rounded-xl p-4">

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1"
                />
                <span>I accept the Terms &amp; Conditions</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className="mt-1"
                />
                <span>I accept the Privacy Notice</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptAuctionRules}
                  onChange={(e) => setAcceptAuctionRules(e.target.checked)}
                  className="mt-1"
                />
                <span>I accept the Auction Rules</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptAsIsDisclaimer}
                  onChange={(e) => setAcceptAsIsDisclaimer(e.target.checked)}
                  className="mt-1"
                />
                <span>I accept the &quot;as-is&quot; disclaimer</span>
              </label>

            </div>

            {/* Error */}
            {register.isError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {getApiErrorMessage(register.error)}
              </p>
            )}

            {/* Button */}
            <Button
              type="submit"
              fullWidth
              disabled={!allAccepted}
              isLoading={register.isPending}
              className="h-11 text-base font-semibold rounded-xl"
            >
              Register
            </Button>

          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            By registering, you agree to our platform policies
          </p>

        </div>
      </div>
    </div>
  );
}
