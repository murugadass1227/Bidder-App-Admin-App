import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage auctions and users.</p>
      <Link
        href="/login"
        className="px-6 py-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900"
      >
        Log in (Admin)
      </Link>
    </main>
  );
}
