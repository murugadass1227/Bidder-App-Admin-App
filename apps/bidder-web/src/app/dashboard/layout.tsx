import Link from "next/link";
import { UserDropdown } from "@/features/auth/components/UserDropdown";
import { OnboardingRedirect } from "./OnboardingRedirect";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingRedirect />
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-primary-600">
          Bidder
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/dashboard/auctions" className="text-gray-600 hover:text-gray-900">
            Browse lots
          </Link>
          <Link href="/dashboard/activity" className="text-gray-600 hover:text-gray-900">
            My activity
          </Link>
          <UserDropdown />
        </nav>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
