import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Auction administration",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
