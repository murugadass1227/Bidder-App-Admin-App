'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { useRouter } from 'next/navigation';

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
      onClose?.(); // Close sidebar on mobile after logout
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout fails
      router.push('/login');
      onClose?.();
    } finally {
      setLoggingOut(false);
    }
  };

  const handleNavigation = () => {
    // Close sidebar on mobile after navigation
    onClose?.();
  };

  return (
    <div className={cn('flex h-full w-64 flex-col bg-gray-900 relative', className)}>
      <div className="flex h-16 shrink-0 items-center justify-between px-6">
        <h1 className="text-xl font-bold text-white">BIC Admin</h1>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="flex flex-1 flex-col overflow-y-auto">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={handleNavigation}
                      className={cn(
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                        'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 transition-colors'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-white',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
      
      {/* User Info and Logout Section */}
      <div className="p-4 border-t border-gray-800 space-y-3 flex-shrink-0">
        {/* User Info */}
        <div className="px-2">
          <p className="text-sm font-medium text-white truncate">
            {user?.name || 'Admin User'}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user?.email || 'admin@example.com'}
          </p>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            'flex w-full items-center gap-x-3 rounded-md p-3 text-sm font-semibold transition-colors',
            loggingOut 
              ? 'text-gray-500 cursor-not-allowed' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          )}
        >
          <LogOut className={cn(
            'h-6 w-6 shrink-0',
            loggingOut ? 'text-gray-500' : 'text-gray-400 group-hover:text-white'
          )} />
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
