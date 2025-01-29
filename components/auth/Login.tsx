/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GrLicense } from 'react-icons/gr';
import { IoMdPerson } from 'react-icons/io';

const Login = () => {
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
        // console.log('Parsed authData:', parsedAuthData);

        // Ensure the required fields are present
        if (
          parsedAuthData.type &&
          parsedAuthData.role &&
          (parsedAuthData.type === 'account' ? parsedAuthData.user : parsedAuthData.licenseKey)
        ) {
          if (parsedAuthData.user && parsedAuthData.user.role) {
            // console.log('Valid auth data, redirecting:', parsedAuthData);
            router.replace('/dashboard');
          } else {
            console.error('Invalid user data in authData, clearing:', parsedAuthData);
            localStorage.removeItem('authData');
          }
        } else {
          console.error('Invalid authData structure, clearing:', parsedAuthData);
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
      const endpoint = loginType === 'account' ? '/api/auth' : '/api/licenses/validate';
      const payload =
        loginType === 'account'
          ? { username: formData.username, password: formData.password }
          : { key: formData.licenseKey, context: 'website' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // console.log('Raw Response:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        throw new Error(errorText || 'Unexpected server response');
      }

      const data = await response.json(); // Parse the JSON response
      // console.log('Parsed Response Data:', data);

      const authData =
        loginType === 'account'
          ? {
              type: 'account',
              role: data.user.role,
              user: data.user,
              token: data.token,
            }
          : {
              type: 'license',
              role: 'user',
              licenseKey: formData.licenseKey,
              license: data.license,
            };

      console.log('Saving authData:', authData);
      localStorage.setItem('authData', JSON.stringify(authData));

      router.replace('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error.message);
      setError(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-dark-800 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md border border-white/10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {loginType === 'account' ? 'Account Login' : 'License Login'}
      </h2>

      <div className="flex gap-3 justify-between mb-5">
        <button
          type="button"
          onClick={() => setLoginType('account')}
          className={`flex flex-col w-full items-start text-start p-5 rounded ${
            loginType === 'account'
              ? 'bg-dark-700 border-white/50 border-[1px] text-white'
              : 'bg-dark-800 border-[1px] border-white/5 text-white/50'
          }`}>
          <span className="flex gap-2 items-center">
            <IoMdPerson className="text-lg" />
            Akun
          </span>
          <p className="text-xs mt-2">Username & Password.</p>
        </button>
        <button
          type="button"
          onClick={() => setLoginType('license')}
          className={`flex flex-col items-start text-start p-5 rounded ${
            loginType === 'license'
              ? 'bg-dark-700 border-white/50 border-[1px] text-white'
              : 'bg-dark-800 border-[1px] border-white/5 text-white/50'
          }`}>
          <span className="flex gap-2 items-center">
            <GrLicense className="text-lg" />
            License Key
          </span>
          <p className="text-sm mt-2">For users with a license key.</p>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {loginType === 'account' ? (
          <>
            <div className="mb-5">
              <label className="block text-gray-300 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                name="username"
                className="shadow appearance-none border border-white/10 rounded w-full py-2 px-3 text-white bg-dark-600"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="shadow appearance-none border border-white/10 rounded w-full py-2 px-3 text-white bg-dark-600"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </>
        ) : (
          <div className="mb-5">
            <label className="block text-gray-300 text-sm font-bold mb-2">License Key</label>
            <input
              type="text"
              className="shadow appearance-none border border-white/10 rounded w-full py-2 px-3 text-white bg-dark-600"
              placeholder="Enter license key"
              value={formData.licenseKey}
              onChange={(e) => setFormData({ ...formData, licenseKey: e.target.value })}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-white text-black font-bold py-2 px-4 rounded w-full">
            {loginType === 'account' ? 'Login' : 'Validate License'}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
