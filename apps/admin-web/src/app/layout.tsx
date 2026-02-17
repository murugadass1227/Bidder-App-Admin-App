'use client';

import "../styles/globals.css";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="flex h-screen bg-gray-50">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {isAuthenticated ? (
        <>
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 lg:z-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Main content */}
          <div className="flex flex-1 flex-col min-w-0 lg:ml-0">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              {children}
            </main>
          </div>
        </>
      ) : (
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      )}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Admin app</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
