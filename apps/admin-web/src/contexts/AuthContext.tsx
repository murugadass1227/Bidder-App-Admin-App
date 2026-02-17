'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (accessToken: string, refreshToken: string, user?: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('userData');
        setIsAuthenticated(!!token);
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (error) {
            console.error('Failed to parse user data:', error);
            localStorage.removeItem('userData');
          }
        }
      }
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        checkAuth();
      }
    };

    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isClient]);

  const login = (accessToken: string, refreshToken: string, userData?: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
      }
    }
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint if available
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (fetchError) {
          console.warn('Logout API call failed (token may be expired):', fetchError);
        }
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    } finally {
      // Always clear local tokens even if API call fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
