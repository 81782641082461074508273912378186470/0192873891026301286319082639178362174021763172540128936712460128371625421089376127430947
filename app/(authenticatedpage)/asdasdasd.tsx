'use client';

import '@/styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem('authData');

    if (!authData) {
      router.push('/login');
      return;
    }

    try {
      const parsedAuthData = JSON.parse(authData);

      if (parsedAuthData.type === 'account' && ['owner', 'admin'].includes(parsedAuthData.role)) {
        if (parsedAuthData.role === 'owner') {
          router.replace('/dashboard/owner');
        } else if (parsedAuthData.role === 'admin') {
          router.replace('/dashboard/admin');
        }
      } else if (parsedAuthData.type === 'license' && parsedAuthData.role === 'user') {
        setRole('user'); // Set the role as user and allow access
      } else {
        localStorage.removeItem('authData'); // Clear invalid data
        router.push('/login'); // Redirect to login
      }
    } catch (error) {
      console.error('Invalid authData format:', error);
      localStorage.removeItem('authData');
      router.push('/login'); // Redirect to login
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authData'); // Clear auth data
    router.push('/login'); // Redirect to login
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-red-500 shadow-md p-4 flex flex-col space-y-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <nav>
            <p className="block font-bold">
              {role && `${role.charAt(0).toUpperCase()}${role.slice(1)} Dashboard`}
            </p>
          </nav>
          <button onClick={handleLogout} className="mt-2 text-sm text-red-500 underline">
            Logout
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-red-500 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
