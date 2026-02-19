"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/features/auth/hooks";

/** Redirect bidders who still need verification to the onboarding flow. */
export function OnboardingRedirect() {
  const router = useRouter();
  const { data: user, isLoading } = useMe();
  const u = user as typeof user & { requiresVerification?: boolean } | undefined;

  useEffect(() => {
    if (isLoading || !u?.id) return;
    if (typeof window !== "undefined" && window.sessionStorage?.getItem("onboarding_skipped")) return;
    if (u.requiresVerification) router.replace("/onboarding");
  }, [isLoading, u?.id, u?.requiresVerification, router]);

  return null;
}
