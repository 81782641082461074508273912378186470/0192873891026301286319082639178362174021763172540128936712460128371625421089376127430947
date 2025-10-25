/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { CheckCircleIcon, CircleXIcon } from 'lucide-react';
import Link from 'next/link';

interface PaymentStatusProps {
  status: 'pending' | 'success' | 'failed';
  transactionId?: string;
  paymentUrl?: string;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, transactionId, paymentUrl }) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-dark-800 border border-white/10 rounded-lg">
      {status === 'pending' && (
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold mb-2">Payment Pending</h2>
          <p className="text-white/70 mb-6">
            Your payment is being processed. Please complete the payment at the payment gateway.
          </p>
          {paymentUrl && (
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-white text-black font-bold rounded-md text-center hover:bg-white/90">
              Complete Payment
            </a>
          )}
          {transactionId && (
            <p className="mt-4 text-xs text-white/50">Transaction ID: {transactionId}</p>
          )}
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Payment Successful</h2>
          <p className="text-white/70 mb-6">
            Thank you for your payment. Your subscription is now active.
          </p>
          <Link
            href="/dashboard"
            className="w-full py-3 bg-white text-black font-bold rounded-md text-center hover:bg-white/90">
            Go to Dashboard
          </Link>
          {transactionId && (
            <p className="mt-4 text-xs text-white/50">Transaction ID: {transactionId}</p>
          )}
        </div>
      )}

      {status === 'failed' && (
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <CircleXIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Payment Failed</h2>
          <p className="text-white/70 mb-6">
            We couldn&rsquo;t process your payment. Please try again or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-white text-black font-bold rounded-md text-center hover:bg-white/90">
            Try Again
          </button>
          {transactionId && (
            <p className="mt-4 text-xs text-white/50">Transaction ID: {transactionId}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
