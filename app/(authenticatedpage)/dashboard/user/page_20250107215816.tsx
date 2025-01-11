'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching auth data
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    if (!authData || !authData.role) {
      router.push('/login');
    } else {
      setRole(authData.role);
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authData'); // Clear auth data
    router.push('/login'); // Redirect to login
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <html lang="en" className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
      <body
        className={`flex h-screen ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}
      >
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col space-y-4">
          <button onClick={toggleTheme} className="mt-auto text-sm underline">
            Toggle Theme
          </button>
          <button
            onClick={handleLogout}
            className="mt-2 text-sm text-red-500 underline"
          >
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
