import { api } from "@/lib/axios";
import type { LoginInput, RegisterInput, AuthTokens } from "./types";

export async function login(data: LoginInput): Promise<AuthTokens> {
  const res = await api.post<AuthTokens>("/auth/login", data);
  return res.data;
}

export async function register(data: RegisterInput): Promise<AuthTokens> {
  const res = await api.post<AuthTokens>("/auth/register", data);
  return res.data;
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  const res = await api.post<AuthTokens>("/auth/refresh", { refreshToken });
  return res.data;
}

export async function logout(refreshToken: string | null): Promise<void> {
  if (refreshToken) {
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch {
      // Ignore errors; clear local state anyway
    }
  }
}

export async function getMe() {
  const res = await api.get("/users/me");
  return res.data;
}

export async function sendVerifyEmail() {
  const res = await api.post<{ sent: boolean; expiresInMinutes: number }>("/auth/send-verify-email");
  return res.data;
}

export async function sendVerifyMobile() {
  const res = await api.post<{ sent: boolean; expiresInMinutes: number }>("/auth/send-verify-mobile");
  return res.data;
}

export async function verifyEmail(code: string) {
  const res = await api.post<{ verified: boolean }>("/auth/verify-email", { code });
  return res.data;
}

export async function verifyMobile(code: string) {
  const res = await api.post<{ verified: boolean }>("/auth/verify-mobile", { code });
  return res.data;
}

export async function updateProfile(data: {
  physicalAddress?: string;
  preferredPaymentMethod?: string;
  companyDetails?: string;
}) {
  const res = await api.patch("/users/me", data);
  return res.data;
}

export async function uploadReservationProof(fileUrl: string) {
  const res = await api.post("/users/me/reservation-proof", { fileUrl });
  return res.data;
}

export async function submitKycDocument(documentType: "ID_COPY" | "BUSINESS_REGISTRATION", fileUrl: string) {
  const res = await api.post("/users/me/kyc", { documentType, fileUrl });
  return res.data;
}
