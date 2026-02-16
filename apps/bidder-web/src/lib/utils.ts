import type { AxiosError } from "axios";

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/** Get a user-friendly message from an API error (axios or other). */
export function getApiErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong";
  const ax = error as AxiosError<{ message?: string | string[] }>;
  const msg = ax.response?.data?.message;
  if (msg !== undefined && msg !== null) {
    return Array.isArray(msg) ? msg.join(" ") : String(msg);
  }
  if (ax.response?.status === 409) return "Email already registered.";
  if (ax.response?.status === 400) return "Invalid input. Check email and password (min 6 characters).";
  if (ax.code === "ERR_NETWORK" || (error as Error)?.message?.includes("Connection refused")) {
    return "Cannot reach the server. Make sure the API is running (pnpm dev).";
  }
  return (error as Error)?.message ?? "Something went wrong";
}
