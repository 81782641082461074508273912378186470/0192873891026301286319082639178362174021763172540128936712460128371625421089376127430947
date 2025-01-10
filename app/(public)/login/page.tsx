/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loginType, setLoginType] = useState<'account' | 'license'>('account');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    licenseKey: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem('authData');

    if (authData) {
      try {
        const parsedAuthData = JSON.parse(authData);
        console.log('Parsed authData:', parsedAuthData);

        // Ensure the required fields are present
        if (
          parsedAuthData.type &&
          parsedAuthData.role &&
          (parsedAuthData.type === 'account'
            ? parsedAuthData.user
            : parsedAuthData.licenseKey)
        ) {
          if (parsedAuthData.user && parsedAuthData.user.role) {
            console.log('Valid auth data, redirecting:', parsedAuthData);
            router.replace('/dashboard');
          } else {
            console.error(
              'Invalid user data in authData, clearing:',
              parsedAuthData
            );
            localStorage.removeItem('authData');
          }
        } else {
          console.error(
            'Invalid authData structure, clearing:',
            parsedAuthData
          );
          localStorage.removeItem('authData');
        }
      } catch (error) {
        console.error('Failed to parse authData, clearing authData:', error);
        localStorage.removeItem('authData');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (loginType === 'account') {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'Login failed');
        }

        // Extract token and user data from response
        const { token, user } = await response.json();

        // Prepare full authData object with all user details
        const authData = {
          type: 'account',
          role: user.role,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            name: user.name,
            whatsappNumber: user.whatsappNumber,
            isActive: user.isActive,
          },
          token,
        };

        // Log and save authData to local storage
        console.log('Saving authData:', authData);
        localStorage.setItem('authData', JSON.stringify(authData));

        // Redirect to the dashboard
        router.replace('/dashboard');
      } else {
        // Handle license login
        const response = await fetch('/api/licenses/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: formData.licenseKey,
            context: 'website',
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'License validation failed');
        }

        const { license } = await response.json(); // Include license data in response

        const authData = {
          type: 'license',
          role: 'user', // License logins are always users
          licenseKey: formData.licenseKey,
          license, // Save license data if needed
        };

        console.log('Saving authData:', authData);
        localStorage.setItem('authData', JSON.stringify(authData));

        // Stay on /dashboard (no redirect to specific role)
        router.replace('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      setError(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div
        key={loginType}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {loginType === 'account' ? 'Account Login' : 'License Login'}
        </h2>

        <div className="flex justify-around mb-4">
          <button
            className={`px-4 py-2 rounded ${
              loginType === 'account' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setLoginType('account')}
          >
            Account Login
          </button>
          <button
            className={`px-4 py-2 rounded ${
              loginType === 'license' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setLoginType('license')}
          >
            License Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {loginType === 'account' ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                License Key
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                placeholder="Enter license key"
                value={formData.licenseKey}
                onChange={(e) =>
                  setFormData({ ...formData, licenseKey: e.target.value })
                }
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {loginType === 'account' ? 'Login' : 'Validate License'}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
