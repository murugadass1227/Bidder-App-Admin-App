"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import * as authApi from "../api";

export function LogoutButton() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleClick = async () => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    await authApi.logout(refreshToken);
    logout();
    router.push("/login");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-gray-600 hover:text-gray-900"
    >
      Log out
    </button>
  );
}
