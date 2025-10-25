'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

/**
 * Payment Success Page
 *
 * This page is shown after the user is redirected from Faspay payment page.
 * It polls the backend to check if the webhook has activated the account.
 */
export default function SuccessPage() {
  const searchParams = useSearchParams();

  // Extract parameters from URL
  const transactionId = searchParams.get('bill_no');
  const faspayTrxId = searchParams.get('trx_id');

  // States for UI and polling
  const [status, setStatus] = useState<'pending' | 'active' | 'error'>('pending');
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(60); // 60 second timeout
  const [pollCount, setPollCount] = useState<number>(0);
  const [userData, setUserData] = useState<{
    username?: string;
    email?: string;
    plan?: string;
    licenseLimit?: number;
  }>({});

  // Error handling
  const [error, setError] = useState<string | null>(null);

  // Start polling when component mounts
  useEffect(() => {
    // Validate transaction ID exists
    if (!transactionId) {
      setStatus('error');
      setError('Invalid transaction ID. Please contact support.');
      setIsPolling(false);
      return;
    }

    const intervals: { pollInterval?: NodeJS.Timeout; timeoutTimer?: NodeJS.Timeout } = {};

    // Function to check account status
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/subscription/status?transactionId=${transactionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to check status');
        }

        // Update poll count
        setPollCount((count) => count + 1);

        // Check if user is active and subscription is active
        if (
          data.success &&
          data.status.user.isActive &&
          data.status.subscription === 'active' &&
          data.status.payment === 'completed'
        ) {
          // Account is active!
          setStatus('active');
          setIsPolling(false);
          setUserData({
            username: data.status.user.username,
            email: data.status.user.email,
            plan: data.status.plan,
            licenseLimit: data.status.licenseLimit,
          });

          // Clear intervals
          if (intervals.pollInterval) clearInterval(intervals.pollInterval);
          if (intervals.timeoutTimer) clearTimeout(intervals.timeoutTimer);
        }
      } catch (error) {
        console.error('Error checking status:', error);
        // Don't stop polling on error - might be temporary
      }
    };

    // Timeout function
    const handleTimeout = () => {
      setIsPolling(false);
      if (intervals.pollInterval) clearInterval(intervals.pollInterval);
    };

    // Start polling every 3 seconds
    intervals.pollInterval = setInterval(checkStatus, 3000);

    // Set timeout for 60 seconds
    intervals.timeoutTimer = setTimeout(handleTimeout, 60000);

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Initial check
    checkStatus();

    // Cleanup intervals on unmount
    return () => {
      if (intervals.pollInterval) clearInterval(intervals.pollInterval);
      if (intervals.timeoutTimer) clearTimeout(intervals.timeoutTimer);
      clearInterval(countdownInterval);
    };
  }, [transactionId]);

  // Function to handle manual check
  const handleManualCheck = async () => {
    setIsPolling(true);
    setCountdown(30); // Reset timeout to 30 seconds

    try {
      const response = await fetch(`/api/subscription/status?transactionId=${transactionId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check status');
      }

      // Check if user is active
      if (
        data.success &&
        data.status.user.isActive &&
        data.status.subscription === 'active' &&
        data.status.payment === 'completed'
      ) {
        // Account is active!
        setStatus('active');
        setIsPolling(false);
        setUserData({
          username: data.status.user.username,
          email: data.status.user.email,
          plan: data.status.plan,
          licenseLimit: data.status.licenseLimit,
        });
      } else {
        // Account still not active
        setStatus('pending');
        setError('Account not activated yet. Please try again later.');
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setError('Failed to check status. Please try again.');
    } finally {
      setIsPolling(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-lg mx-auto">
      <div className="w-full bg-dark-800/40 border-[1px] border-white/10 rounded-lg p-8 shadow-lg backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          {status === 'pending' && (
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
              {isPolling ? (
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
              ) : (
                <Clock className="w-8 h-8 text-yellow-500" />
              )}
            </div>
          )}

          {status === 'active' && (
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          )}

          {status === 'error' && (
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          )}

          <h1 className="text-2xl font-bold text-center">
            {status === 'pending' && 'Payment Processing'}
            {status === 'active' && 'Payment Successful'}
            {status === 'error' && 'Error Processing Payment'}
          </h1>

          <p className="text-sm text-white/70 text-center mt-2">
            {status === 'pending' &&
              'Your payment is being processed. Please wait while we activate your account.'}
            {status === 'active' &&
              'Your payment has been confirmed and your account is now active.'}
            {status === 'error' && error}
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-dark-900/50 p-4 rounded-md mb-6 text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-white/60">Transaction ID:</span>
            <span className="font-mono">{transactionId || 'N/A'}</span>
          </div>
          {faspayTrxId && (
            <div className="flex justify-between mb-2">
              <span className="text-white/60">Faspay ID:</span>
              <span className="font-mono">{faspayTrxId}</span>
            </div>
          )}
          {status === 'pending' && isPolling && (
            <div className="flex justify-between">
              <span className="text-white/60">Status Check:</span>
              <span>
                Attempt {pollCount} ({countdown}s remaining)
              </span>
            </div>
          )}
          {status === 'active' && (
            <>
              <div className="flex justify-between mb-2">
                <span className="text-white/60">Username:</span>
                <span>{userData.username}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-white/60">Plan:</span>
                <span className="capitalize">{userData.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">License Limit:</span>
                <span>{userData.licenseLimit}</span>
              </div>
            </>
          )}
        </div>

        {/* Next Steps */}
        <div className="mb-6">
          <h3 className="font-bold mb-2 border-b border-white/10 pb-1">Langkah Selanjutnya</h3>
          {status === 'pending' && (
            <ul className="space-y-2 text-sm text-white/80 list-disc pl-5">
              <li>Tunggu hingga pembayaran diproses dan akun diaktifkan</li>
              <li>Proses aktivasi biasanya membutuhkan waktu kurang dari 1 menit</li>
              <li>Halaman ini akan otomatis memperbarui status</li>
              <li>Setelah aktif, Anda dapat masuk dengan username dan password</li>
            </ul>
          )}

          {status === 'active' && (
            <ul className="space-y-2 text-sm text-white/80 list-disc pl-5">
              <li>Akun Anda telah berhasil diaktifkan</li>
              <li>Login dengan username dan password yang telah Anda daftarkan</li>
              <li>Mulai kelola lisensi Anda di dashboard</li>
              <li>Limit lisensi Anda: {userData.licenseLimit || 'N/A'}</li>
            </ul>
          )}

          {status === 'error' && (
            <ul className="space-y-2 text-sm text-white/80 list-disc pl-5">
              <li>Pembayaran mungkin masih diproses</li>
              <li>Coba periksa status secara manual</li>
              <li>Jika masalah berlanjut, hubungi dukungan pelanggan</li>
              <li>Sertakan Transaction ID dalam korespondensi Anda</li>
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          {status === 'pending' && !isPolling && (
            <button
              onClick={handleManualCheck}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-md transition-colors">
              Periksa Status Sekarang
            </button>
          )}

          {status === 'active' && (
            <Link
              href="/dashboard/auth"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-md text-center flex items-center justify-center gap-2">
              Login to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Link
            href="/"
            className="w-full py-3 bg-dark-700 hover:bg-dark-600 text-white/80 font-medium rounded-md text-center">
            Kembali ke Home
          </Link>

          <div className="text-center mt-4">
            <Link
              href="mailto:support@autolaku.com"
              className="text-xs text-blue-400 hover:underline">
              Butuh bantuan? Hubungi support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
