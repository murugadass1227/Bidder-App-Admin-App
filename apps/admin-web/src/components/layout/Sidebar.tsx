'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Car,
  Gavel,
  Users,
  TrendingUp,
  Activity,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Lots', href: '/lots', icon: Car },
  { name: 'Auctions', href: '/auctions', icon: Gavel },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Bid Monitoring', href: '/bids', icon: Activity },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push('/login');
      onClose?.();
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
      onClose?.();
    } finally {
      setLoggingOut(false);
    }
  };

  const handleNavigation = () => {
    onClose?.();
  };

  return (
    <div
      className={cn(
        'flex h-full w-64 flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-r border-gray-800 shadow-xl relative',
        className
      )}
    >
      {/* Logo / Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white tracking-tight">
          BIC Admin
        </h1>

        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col overflow-y-auto py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-1 px-3">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={handleNavigation}
                  className={cn(
                    'group flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 shrink-0 transition',
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-white'
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800 space-y-3 flex-shrink-0 bg-gray-900/60 backdrop-blur">
        
        {/* User Info */}
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
            <span className="text-white text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || 'admin@example.com'}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            'flex w-full items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
            loggingOut
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          )}
        >
          <LogOut
            className={cn(
              'h-5 w-5 shrink-0',
              loggingOut ? 'text-gray-500' : 'text-gray-400'
            )}
          />
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>

      </div>
    </div>
  );
}
