import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;
  const showRegisteredMessage = params?.registered === "1";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* <h1 className="text-2xl font-bold mb-6">Log in</h1> */}
      {showRegisteredMessage && (
        <p className="mb-4 text-sm text-green-600">Registration successful. Please log in.</p>
      )}
      <LoginForm />
      <p className="mt-4 text-sm text-gray-600">
        No account? <Link href="/register" className="text-primary-600 hover:underline">Register</Link>
      </p>
    </main>
  );
}
