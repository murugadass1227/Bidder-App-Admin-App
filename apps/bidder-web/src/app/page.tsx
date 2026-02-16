import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-primary-600 mb-4">Bidder App</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Place real-time bids on active auctions. Sign in or register to get started.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 rounded-lg border-2 border-primary-600 text-primary-600 font-medium hover:bg-primary-50"
        >
          Register
        </Link>
        <Link
          href="/dashboard/auctions"
          className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
        >
          Browse Auctions
        </Link>
      </div>
    </main>
  );
}
