'use client';

import { useState } from 'react';
import { Bell, Search, User, LogOut, ChevronDown, Menu } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
}

export function Header({ className, onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push('/login');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
      setShowUserMenu(false);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header
      className={cn(
        'flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/90 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8',
        className
      )}
    >
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">

        {/* Search */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search lots, auctions, users..."
              className="pl-10 text-sm h-10 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-x-2 lg:gap-x-4">

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center shadow">
              3
            </span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-x-2 px-2 lg:px-3 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <User className="h-5 w-5 text-white" />
              </div>

              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[140px]">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>

              <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
            </Button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-3 border-b border-gray-100 lg:hidden">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-x-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
