/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  role: string | null;
  user: any;
  license?: any;
  type: 'account' | 'license' | null; // Explicitly define allowed types
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

  useEffect(() => {
    const authData = localStorage.getItem('authData');

    if (!authData) {
      localStorage.removeItem('authData');
      setRole(null);
      setUser(null);
      setLicense(null);
      setType(null);
      setAuthDetails(null);
      setIsAuthenticated(false);
      router.push('/auth');
      return;
    }

    try {
      const parsedAuthData = JSON.parse(authData);
      // console.log('Parsed authData:', parsedAuthData);

      // Validate and set auth details based on type and role
      if (
        (parsedAuthData.type === 'account' && ['owner', 'admin'].includes(parsedAuthData.role)) ||
        (parsedAuthData.type === 'license' && parsedAuthData.role === 'user')
      ) {
        setRole(parsedAuthData.role);
        setUser(parsedAuthData.user || null);
        setLicense(parsedAuthData.license || null);
        setType(parsedAuthData.type || null);
        setAuthDetails(parsedAuthData); // Store the full authData for detailed use
        setIsAuthenticated(true);
      } else {
        console.error('Invalid authData');
        localStorage.removeItem('authData');
        setRole(null);
        setUser(null);
        setLicense(null);
        setType(null);
        setAuthDetails(null);
        setIsAuthenticated(false);
        router.push('/auth');
      }
    } catch (error) {
      console.error('Failed to parse authData:', error);
      localStorage.removeItem('authData');
      setRole(null);
      setUser(null);
      setLicense(null);
      setType(null);
      setAuthDetails(null);
      setIsAuthenticated(false);
      router.push('/auth');
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
    setType(data.type); // Ensure this matches `'account' | 'license'`
    setAuthDetails(data); // Store full auth details
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authData');
    setRole(null);
    setUser(null);
    setLicense(null);
    setType(null);
    setAuthDetails(null);
    setIsAuthenticated(false);
    router.push('/auth');
  };

  // console.log(authDetails);
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
