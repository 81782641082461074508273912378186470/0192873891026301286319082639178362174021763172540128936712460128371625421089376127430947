'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem('authData');

    if (!authData) {
      router.replace('/login'); // Redirect if no auth data
      return;
    }

    try {
      const { type, role } = JSON.parse(authData);

      // Validate the type and role
      if (type !== 'account' || role !== 'admin') {
        localStorage.removeItem('authData'); // Clear invalid auth data
        router.replace('/login'); // Redirect to login
      }
    } catch (error) {
      console.error('Invalid authData format, clearing localStorage:', error);
      localStorage.removeItem('authData'); // Clear invalid auth data
      router.replace('/login'); // Redirect to login
    }
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold bg-red-600">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard.</p>
    </div>
  );
}
