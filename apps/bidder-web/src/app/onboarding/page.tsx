"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "@repo/ui";
import { useMe } from "@/features/auth/hooks";
import * as authApi from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useMe();
  const [emailCode, setEmailCode] = useState("");
  const [mobileCode, setMobileCode] = useState("");
  const [reservationProofUrl, setReservationProofUrl] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState("");
  const [companyDetails, setCompanyDetails] = useState("");
  const [kycIdUrl, setKycIdUrl] = useState("");
  const [kycBusinessUrl, setKycBusinessUrl] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingMobile, setSendingMobile] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingMobile, setVerifyingMobile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [submittingKyc, setSubmittingKyc] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const refreshMe = () => queryClient.invalidateQueries({ queryKey: ["me"] });

  if (isLoading || isError) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        {isError ? (
          <p className="text-red-600">Not signed in. Redirecting…</p>
        ) : (
          <p className="text-gray-600">Loading…</p>
        )}
      </div>
    );
  }

  const u = user as typeof user & { requiresVerification?: boolean; canBid?: boolean };
  if (!u?.id) {
    router.replace("/login");
    return null;
  }
  if (!u.requiresVerification) {
    router.replace("/dashboard");
    return null;
  }

  const emailDone = !!u.emailVerifiedAt;
  const mobileDone = !!u.mobileVerifiedAt;
  const reservationDone = !!u.reservationProofVerifiedAt;
  const profileFilled =
    !!u.physicalAddress?.trim() || !!u.preferredPaymentMethod?.trim() || !!u.companyDetails?.trim();
  const kycApproved = u.kycStatus === "APPROVED";
  const kycSubmitted = u.kycStatus === "SUBMITTED" || kycApproved;

  const handleSendEmailVerification = async () => {
    setMessage(null);
    setSendingEmail(true);
    try {
      await authApi.sendVerifyEmail();
      setMessage({ type: "success", text: "Verification code sent to your email." });
    } catch (e) {
      setMessage({ type: "error", text: getApiErrorMessage(e) });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailCode.trim()) return;
    setMessage(null);
    setVerifyingEmail(true);
    try {
      await authApi.verifyEmail(emailCode.trim());
      setEmailCode("");
      setMessage({ type: "success", text: "Email verified." });
      refreshMe();
    } catch (e) {
      setMessage({ type: "error", text: getApiErrorMessage(e) });
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSendMobileOtp = async () => {
    setMessage(null);
    setSendingMobile(true);
    try {
      await authApi.sendVerifyMobile();
      setMessage({ type: "success", text: "OTP sent to your mobile." });
    } catch (e) {
      setMessage({ type: "error", text: getApiErrorMessage(e) });
    } finally {
      setSendingMobile(false);
    }
  };

  const handleVerifyMobile = async () => {
    if (!mobileCode.trim()) return;
    setMessage(null);
    setVerifyingMobile(true);
    try {
      await authApi.verifyMobile(mobileCode.trim());
      setMobileCode("");
      setMessage({ type: "success", text: "Mobile verified." });
      refreshMe();
    } catch (e) {
      setMessage({ type: "error", text: getApiErrorMessage(e) });
    } finally {
      setVerifyingMobile(false);
    }
  };

  const handleUploadReservationProof = async () => {
    if (!reservationProofUrl.trim()) return;
    setMessage(null);
    setUploadingProof(true);
    try {
      await authApi.uploadReservationProof(reservationProofUrl.trim());
      setReservationProofUrl("");
      setMessage({ type: "success", text: "Reservation proof uploaded." });
      refreshMe();
    } catch (e) {
      setMessage({ type: "error", text: getApiErrorMessage(e) });
    } finally {
      setUploadingProof(false);
    }
  };

  const handleSaveProfile = async () => {
    setMessage(null);
    setSavingProfile(true);
    try {
      await authApi.updateProfile({
        physicalAddress: physicalAddress.trim() || undefined,
        preferredPaymentMethod: preferredPaymentMethod.trim() || undefined,
        companyDetails: companyDetails.trim() || undefined,
      });
      setMessage({ type: "success", text: "Profile saved." });
      refreshMe();
    } catch (e) {
      setMessage({ type: "error", text: getApiErrorMessage(e) });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitKyc = async () => {
    setMessage(null);
    setSubmittingKyc(true);
    try {
      if (kycIdUrl.trim()) await authApi.submitKycDocument("ID_COPY", kycIdUrl.trim());
      if (kycBusinessUrl.trim()) await authApi.submitKycDocument("BUSINESS_REGISTRATION", kycBusinessUrl.trim());
      setKycIdUrl("");
      setKycBusinessUrl("");
      setMessage({ type: "success", text: "KYC documents submitted. Awaiting approval." });
      refreshMe();
    } catch (e) {
      setMessage({ type: "error", text: getApiErrorMessage(e) });
    } finally {
      setSubmittingKyc(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Complete your bidder account</h1>
      <p className="text-gray-600">
        Verify your contact details, upload reservation proof, complete profile and KYC to start bidding.
      </p>

      {message && (
        <p className={message.type === "success" ? "text-green-700 text-sm" : "text-red-600 text-sm"}>
          {message.text}
        </p>
      )}

      {/* 1. Email verification */}
      <section className="bg-white p-4 rounded-lg border">
        <h2 className="font-semibold mb-2 flex items-center gap-2">
          {emailDone ? "✓" : "1."} Email verification {emailDone && "(done)"}
        </h2>
        {!emailDone && (
          <div className="space-y-2">
            <Button type="button" onClick={handleSendEmailVerification} disabled={sendingEmail} size="sm">
              {sendingEmail ? "Sending…" : "Send verification code"}
            </Button>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code from email"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
                className="max-w-xs"
              />
              <Button type="button" onClick={handleVerifyEmail} disabled={verifyingEmail || !emailCode.trim()} size="sm">
                Verify
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* 2. Mobile verification */}
      <section className="bg-white p-4 rounded-lg border">
        <h2 className="font-semibold mb-2 flex items-center gap-2">
          {mobileDone ? "✓" : "2."} Mobile verification (OTP) {mobileDone && "(done)"}
        </h2>
        {!mobileDone && (
          <div className="space-y-2">
            <Button type="button" onClick={handleSendMobileOtp} disabled={sendingMobile} size="sm">
              {sendingMobile ? "Sending…" : "Send OTP"}
            </Button>
            <div className="flex gap-2">
              <Input
                placeholder="Enter OTP"
                value={mobileCode}
                onChange={(e) => setMobileCode(e.target.value)}
                className="max-w-xs"
              />
              <Button type="button" onClick={handleVerifyMobile} disabled={verifyingMobile || !mobileCode.trim()} size="sm">
                Verify
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* 3. Reservation proof */}
      <section className="bg-white p-4 rounded-lg border">
        <h2 className="font-semibold mb-2 flex items-center gap-2">
          {reservationDone ? "✓" : "3."} Reservation amount proof {reservationDone && "(done)"}
        </h2>
        {!reservationDone && (
          <div className="space-y-2">
            <Input
              placeholder="Document URL (upload elsewhere and paste link)"
              value={reservationProofUrl}
              onChange={(e) => setReservationProofUrl(e.target.value)}
            />
            <Button
              type="button"
              onClick={handleUploadReservationProof}
              disabled={uploadingProof || !reservationProofUrl.trim()}
              size="sm"
            >
              Upload
            </Button>
          </div>
        )}
      </section>

      {/* 4. Profile */}
      <section className="bg-white p-4 rounded-lg border">
        <h2 className="font-semibold mb-2 flex items-center gap-2">
          {profileFilled ? "✓" : "4."} Profile (address, payment, company)
        </h2>
        <div className="space-y-2">
          <Input
            label="Physical address"
            placeholder="Your address"
            value={physicalAddress}
            onChange={(e) => setPhysicalAddress(e.target.value)}
          />
          <Input
            label="Preferred payment method"
            placeholder="e.g. Bank transfer, Card"
            value={preferredPaymentMethod}
            onChange={(e) => setPreferredPaymentMethod(e.target.value)}
          />
          <Input
            label="ID / Company details (optional)"
            placeholder="Company name or ID info"
            value={companyDetails}
            onChange={(e) => setCompanyDetails(e.target.value)}
          />
          <Button type="button" onClick={handleSaveProfile} disabled={savingProfile} size="sm">
            Save profile
          </Button>
        </div>
      </section>

      {/* 5. KYC */}
      <section className="bg-white p-4 rounded-lg border">
        <h2 className="font-semibold mb-2 flex items-center gap-2">
          {kycApproved ? "✓" : "5."} KYC documents {kycApproved && "(approved)"} {kycSubmitted && !kycApproved && "(submitted)"}
        </h2>
        {!kycApproved && (
          <div className="space-y-2">
            <Input
              label="ID copy (URL)"
              placeholder="Link to uploaded ID"
              value={kycIdUrl}
              onChange={(e) => setKycIdUrl(e.target.value)}
            />
            <Input
              label="Business registration (URL, optional)"
              placeholder="Link to business doc"
              value={kycBusinessUrl}
              onChange={(e) => setKycBusinessUrl(e.target.value)}
            />
            <Button
              type="button"
              onClick={handleSubmitKyc}
              disabled={submittingKyc || (!kycIdUrl.trim() && !kycBusinessUrl.trim())}
              size="sm"
            >
              Submit KYC
            </Button>
          </div>
        )}
      </section>

      {!u.requiresVerification && (
        <Button type="button" onClick={() => router.push("/dashboard")}>
          Go to dashboard
        </Button>
      )}

      {/* Sticky skip bar so it's always visible without scrolling */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white/95 backdrop-blur py-4 px-4 safe-area-pb">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            You can complete verification later.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.sessionStorage.setItem("onboarding_skipped", "1");
              }
              router.push("/dashboard");
            }}
            className="w-full sm:w-auto min-w-[200px]"
          >
            Skip for now — go to dashboard
          </Button>
        </div>
      </div>
      {/* Spacer so page content isn't hidden behind fixed bar */}
      <div className="h-24" />
    </div>
  );
}
