'use client';

import { useState } from 'react';
import { Bell, Search, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
      // Still redirect even if logout fails
      router.push('/login');
      setShowUserMenu(false);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className={cn('flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8', className)}>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        className="lg:hidden p-2"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search lots, auctions, users..."
              className="pl-10 text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-x-2 lg:gap-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-x-2 px-2 lg:px-3"
            >
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
            </Button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100 lg:hidden">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

import { cn } from '@/utils/cn';
