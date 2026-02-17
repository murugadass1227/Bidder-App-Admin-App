import Link from "next/link";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/onboarding" className="text-xl font-bold text-primary-600">
          Complete your account
        </Link>
        <LogoutButton />
      </header>
      <main className="flex-1 p-6 max-w-2xl mx-auto w-full">{children}</main>
    </div>
  );
}
