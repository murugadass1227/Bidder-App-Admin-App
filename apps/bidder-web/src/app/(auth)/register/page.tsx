import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* <h1 className="text-2xl font-bold mb-6">Create account</h1> */}
      <RegisterForm />
      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <Link href="/login" className="text-primary-600 hover:underline">Log in</Link>
      </p>
    </main>
  );
}
