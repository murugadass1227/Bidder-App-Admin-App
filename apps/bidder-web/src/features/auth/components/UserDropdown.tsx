"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useMe } from "../hooks";
import * as authApi from "../api";

export function UserDropdown() {
  const router = useRouter();
  const storeUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const user = me ?? storeUser;
  const displayName = user?.fullName ?? user?.name ?? user?.email ?? "Account";
  const email = user?.email ?? "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    const refreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    await authApi.logout(refreshToken);
    logout();
    router.push("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
          {(displayName.charAt(0) || "?").toUpperCase()}
        </span>
        <span className="hidden sm:inline max-w-[140px] truncate">
          {displayName}
        </span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="truncate font-medium text-gray-900">{displayName}</p>
            <p className="truncate text-sm text-gray-500">{email}</p>
          </div>
          <div className="py-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
