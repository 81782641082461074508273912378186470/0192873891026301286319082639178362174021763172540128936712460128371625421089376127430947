'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { role } = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        if (role !== 'user') {
          router.push('/login'); // Redirect to login if not a user
        }
      } catch {
        console.error('Invalid token, redirecting to login');
        localStorage.removeItem('token'); // Clear invalid token
        router.push('/login');
      }
    } else {
      router.push('/login'); // Redirect if no token
    }
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p>Welcome to the user dashboard.</p>
    </div>
  );
}
