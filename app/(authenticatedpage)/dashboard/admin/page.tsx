'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem('authData');

    if (!authData) {
      router.replace('/auth');
      return;
    }

    try {
      const { type, role } = JSON.parse(authData);

      if (type !== 'account' || role !== 'admin') {
        localStorage.removeItem('authData');
        router.replace('/auth');
      }
    } catch (error) {
      console.error('Invalid authData format, clearing localStorage:', error);
      localStorage.removeItem('authData');
      router.replace('/auth');
    }
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold bg-red-600">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard.</p>
    </div>
  );
}
