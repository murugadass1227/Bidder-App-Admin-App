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
