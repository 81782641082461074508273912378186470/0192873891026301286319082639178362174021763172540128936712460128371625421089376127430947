'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const { role } = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload

        if (role !== 'user') {
          router.push('/login'); // Redirect to login if not a user
        } else {
          setLoading(false); // Set loading to false if user is authenticated
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

  if (loading) {
    // Don't show anything while checking
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p>Welcome to the user dashboard.</p>
    </div>
  );
}
