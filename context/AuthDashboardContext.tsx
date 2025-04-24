/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  role: string | null;
  user: any;
  license?: any;
  type: 'account' | 'license' | null;
  isAuthenticated: boolean;
  authDetails: any | null;
  setAuthData: (data: {
    role: string;
    user: any;
    license?: any;
    type: 'account' | 'license';
  }) => void;
  handleLogout: () => void;
}

const AuthDashboardContext = createContext<AuthContextType | undefined>(undefined);

export const AuthDashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [license, setLicense] = useState<any | null>(null);
  const [type, setType] = useState<'account' | 'license' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authDetails, setAuthDetails] = useState<any | null>(null);
  const router = useRouter();

  // Helper function to get a cookie by name
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Helper function to set a cookie with a shared domain
  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;domain=.autolaku.com`;
  };

  // Helper function to delete a cookie
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.autolaku.com`;
  };

  useEffect(() => {
    const authDataCookie = getCookie('authData');

    if (!authDataCookie) {
      deleteCookie('authData');
      setRole(null);
      setUser(null);
      setLicense(null);
      setType(null);
      setAuthDetails(null);
      setIsAuthenticated(false);

      window.location.href = 'https://autolaku.com/auth';
      return;
    }

    try {
      const parsedAuthData = JSON.parse(authDataCookie);
      if (
        (parsedAuthData.type === 'account' && ['owner', 'admin'].includes(parsedAuthData.role)) ||
        (parsedAuthData.type === 'license' && parsedAuthData.role === 'user')
      ) {
        setRole(parsedAuthData.role);
        setUser(parsedAuthData.user || null);
        setLicense(parsedAuthData.license || null);
        setType(parsedAuthData.type || null);
        setAuthDetails(parsedAuthData);
        setIsAuthenticated(true);
      } else {
        console.error('Invalid authData');
        deleteCookie('authData');
        setRole(null);
        setUser(null);
        setLicense(null);
        setType(null);
        setAuthDetails(null);
        setIsAuthenticated(false);

        window.location.href = 'https://autolaku.com/auth';
      }
    } catch (error) {
      console.error('Failed to parse authData cookie:', error);
      deleteCookie('authData');
      setRole(null);
      setUser(null);
      setLicense(null);
      setType(null);
      setAuthDetails(null);
      setIsAuthenticated(false);

      window.location.href = 'https://autolaku.com/auth';
    }
  }, [router]);

  const setAuthData = (data: {
    role: string;
    user: any;
    license?: any;
    type: 'account' | 'license';
  }) => {
    setRole(data.role);
    setUser(data.user || null);
    setLicense(data.license || null);
    setType(data.type);
    setAuthDetails(data);
    setIsAuthenticated(true);
    setCookie('authData', JSON.stringify(data), 30); // Persist auth data in cookie for 30 days
  };

  const handleLogout = () => {
    deleteCookie('authData');
    setRole(null);
    setUser(null);
    setLicense(null);
    setType(null);
    setAuthDetails(null);
    setIsAuthenticated(false);

    window.location.href = 'https://autolaku.com/auth';
  };

  return (
    <AuthDashboardContext.Provider
      value={{
        role,
        user,
        license,
        type,
        isAuthenticated,
        authDetails,
        setAuthData,
        handleLogout,
      }}>
      {children}
    </AuthDashboardContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthDashboardContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthDashboardProvider');
  }
  return context;
};
