/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { SubscriptionPlan } from '@/types/subscription';

interface PaymentFormProps {
  plan: SubscriptionPlan;
  price: number;
  onPaymentComplete: (transactionId: string, paymentUrl: string) => void;
  onBack: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ plan, price, onPaymentComplete, onBack }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get auth token from cookies
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const authToken = getCookie('authToken');

      // Call the subscription creation API which will initiate Faspay QRIS payment
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        },
        body: JSON.stringify({
          plan: plan,
          durationMonths: 1,
          autoRenew: true,
        }),
      });

      const result = await response.json();

      if (result.success && result.payment.paymentUrl) {
        onPaymentComplete(result.payment.transactionId, result.payment.paymentUrl);
      } else {
        throw new Error(result.error || 'Failed to initiate QRIS payment');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to initiate QRIS payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Pembayaran QRIS</h2>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-white/70 hover:text-white"
        >
          ← Kembali ke Paket
        </button>
      </div>
      
      <div className="bg-dark-800 border border-white/10 rounded-lg p-5 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold __gradient_text">
            Paket {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </h3>
          <div className="text-right">
            <span className="text-lg font-bold">IDR {price.toLocaleString()}</span>
            <span className="text-xs text-white/50">/bulan</span>
          </div>
        </div>
        <p className="text-sm text-white/70">
          Langganan bulanan dengan perpanjangan otomatis. Dapat dibatalkan kapan saja.
        </p>
      </div>
      
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-5 mb-6">
        <h3 className="text-white font-medium mb-3 flex items-center">
          <span className="mr-2">📱</span>
          Pembayaran via QRIS
        </h3>
        <div className="space-y-2 text-sm text-white/80">
          <p>• Scan QR code dengan aplikasi e-wallet atau mobile banking Anda</p>
          <p>• Mendukung: GoPay, OVO, DANA, ShopeePay, LinkAja, dan semua bank</p>
          <p>• Pembayaran aman dan instan</p>
          <p>• Tidak perlu registrasi tambahan</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/20 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handlePaymentSubmit} className="space-y-6">
        <div className="pt-4 border-t border-white/10">
          <p className="text-sm text-white/70 mb-4">
            Dengan melanjutkan pembayaran, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi kami.
            Langganan Anda akan diperpanjang otomatis setiap bulan hingga dibatalkan.
          </p>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-bold ${
              loading
                ? 'bg-dark-600 text-white/50 cursor-not-allowed'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {loading ? 'Memproses...' : `Bayar dengan QRIS - IDR ${price.toLocaleString()}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
