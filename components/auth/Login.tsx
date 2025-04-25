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
  const [messageProgress, setMessageProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const isLocalhost = window.location.hostname === 'localhost';
    document.cookie = `${name}=${value};${expires};path=/${
      isLocalhost ? '' : ';domain=autolaku.com'
    }`;
  };

  useEffect(() => {
    const authDataCookie = getCookie('authData');
    if (authDataCookie) {
      try {
        const parsedAuthData = JSON.parse(authDataCookie);
        const isLocalhost = window.location.hostname === 'localhost';

        if (parsedAuthData.type && parsedAuthData.role) {
          if (
            (parsedAuthData.type === 'account' &&
              parsedAuthData.user &&
              parsedAuthData.user.role) ||
            (parsedAuthData.type === 'license' &&
              parsedAuthData.licenseKey &&
              parsedAuthData.license)
          ) {
            window.location.href = isLocalhost
              ? 'http://localhost:3000/app'
              : 'https://app.autolaku.com';
          } else {
            console.error('Invalid authData structure in cookie, clearing:', parsedAuthData);
            document.cookie = `authData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${
              isLocalhost ? '' : ';domain=autolaku.com'
            }`;
          }
        } else {
          console.error('Missing type or role in authData, clearing:', parsedAuthData);
          document.cookie = `authData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${
            isLocalhost ? '' : ';domain=autolaku.com'
          }`;
        }
      } catch (error) {
        const isLocalhost = window.location.hostname === 'localhost';
        console.error('Failed to parse authData cookie, clearing:', error);
        document.cookie = `authData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${
          isLocalhost ? '' : ';domain=autolaku.com'
        }`;
      }
    }
  }, [router]);

  const startTimer = (messageType: 'error' | 'success', message: string) => {
    if (messageType === 'error') {
      setError(message);
    }
    setMessageProgress(100);
    const timer = setInterval(() => {
      setMessageProgress((prevProgress) => {
        if (prevProgress > 0) {
          return prevProgress - 20;
        } else {
          clearInterval(timer);
          setError(null);
          return 0;
        }
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        throw new Error(errorText || 'Unexpected server response');
      }

      const data = await response.json();

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

      console.log('Saving authData to cookie:', authData);
      setCookie('authData', JSON.stringify(authData), 30);
      const isLocalhost = window.location.hostname === 'localhost';
      window.location.href = isLocalhost ? 'http://localhost:3000/app' : 'https://app.autolaku.com';
    } catch (error: any) {
      console.error('Login error:', error.message);
      startTimer('error', 'Terjadi Kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[350px]">
      <div className="flex flex-col gap-3 justify-center w-full mb-5">
        <button
          type="button"
          onClick={() => setLoginType('license')}
          className={`flex flex-col items-start text-start p-5 rounded ${
            loginType === 'license'
              ? 'bg-dark-700 border-white/50 border-[1px] text-white'
              : 'bg-dark-800 border-[1px] border-white/5 text-white/50'
          }`}>
          <span className="flex gap-2 items-center">
            <GrLicense className="lg:text-lg" />
            License Key
          </span>
          <p className="text-xs lg:text-sm mt-2">Masuk menggunakan License Key</p>
        </button>
        <button
          type="button"
          onClick={() => setLoginType('account')}
          className={`flex flex-col items-start text-start p-5 rounded ${
            loginType === 'account'
              ? 'bg-dark-700 border-white/50 border-[1px] text-white'
              : 'bg-dark-800 border-[1px] border-white/5 text-white/50'
          }`}>
          <span className="flex gap-2 items-center">
            <IoMdPerson className="lg:text-lg" />
            Akun
          </span>
          <p className="text-xs lg:text-sm mt-2">Masuk dengan username dan password.</p>
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
                className="__input"
                placeholder="TonaldDrump01"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                className="__input"
                placeholder="DruMpTonaLd01#"
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
              className="__input"
              placeholder="ABCD-1234-EFGH-5678"
              required
              value={formData.licenseKey}
              onChange={(e) => setFormData({ ...formData, licenseKey: e.target.value })}
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-10">
          {loginType === 'account' ? (
            <button
              type="submit"
              className={`font-bold py-2 px-4 rounded w-full ${
                loading ? 'bg-dark-600 text-white opacity-50' : 'bg-white text-black'
              }`}
              disabled={loading}>
              {loading ? 'Mohon Tunggu...' : 'Masuk'}
            </button>
          ) : (
            <button
              type="submit"
              className={`font-bold py-2 px-4 rounded w-full ${
                loading ? 'bg-dark-600 text-white' : 'bg-white text-black'
              }`}
              disabled={loading}>
              {loading ? 'Mohon Tunggu...' : 'Validasi License'}
            </button>
          )}
        </div>

        {error && (
          <div>
            <p
              className={`px-3 py-1 w-full text-center mt-5 ${
                error
                  ? 'text-red-500 bg-red-500/20 text-sm'
                  : 'bg-green-500/20 text-green-500 text-sm'
              }`}>
              {error}
            </p>
            <div className="h-0.5 bg-dark-700 absolute bottom-0 left-0 w-full ">
              <div
                className={`w-full text-center ${
                  error ? 'bg-red-500 text-sm' : 'text-green-500 text-sm'
                }`}
                style={{ width: `${messageProgress}%` }}></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
