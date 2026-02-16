import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome. Browse and bid on active auctions.</p>
      <Link
        href="/dashboard/auctions"
        className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        View Auctions
      </Link>
    </div>
  );
}
