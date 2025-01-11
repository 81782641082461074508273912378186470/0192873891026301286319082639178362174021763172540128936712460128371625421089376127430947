'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString); // Parse stored auth data
        if (authData.role !== 'user' || authData.type !== 'license') {
          router.push('/login'); // Redirect if role or type is incorrect
        } else {
          setLoading(false); // Set loading to false if user is authenticated
        }
      } catch {
        console.error('Invalid auth data, redirecting to login');
        localStorage.removeItem('authData'); // Clear invalid data
        router.push('/login');
      }
    } else {
      router.push('/login'); // Redirect if no auth data
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
