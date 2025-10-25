'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CircleX, ArrowLeft, RefreshCw, AlertCircle, Mail } from 'lucide-react';

/**
 * Payment Failure Page
 *
 * This page is shown after a failed payment attempt.
 * It displays failure details and provides retry options.
 */
export default function FailurePage() {
  const searchParams = useSearchParams();

  // Extract parameters from URL
  const transactionId = searchParams.get('bill_no');
  const faspayTrxId = searchParams.get('trx_id');
  const statusCode = searchParams.get('status_code');

  // Get failure reason based on status code
  const getFailureReason = (code: string | null) => {
    switch (code) {
      case '3':
        return 'Pembayaran ditolak oleh penyedia layanan pembayaran.';
      case '5':
        return 'Waktu pembayaran telah habis.';
      default:
        return 'Terjadi kesalahan saat memproses pembayaran Anda.';
    }
  };

  const failureReason = getFailureReason(statusCode);

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-lg mx-auto">
      <div className="w-full bg-dark-800/40 border-[1px] border-white/10 rounded-lg p-8 shadow-lg backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <CircleX className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-center">Pembayaran Gagal</h1>

          <p className="text-sm text-white/70 text-center mt-2">
            Maaf, pembayaran Anda tidak berhasil diproses.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-dark-900/50 p-4 rounded-md mb-6 text-sm">
          {transactionId && (
            <div className="flex justify-between mb-2">
              <span className="text-white/60">Transaction ID:</span>
              <span className="font-mono">{transactionId}</span>
            </div>
          )}

          {faspayTrxId && (
            <div className="flex justify-between mb-2">
              <span className="text-white/60">Faspay ID:</span>
              <span className="font-mono">{faspayTrxId}</span>
            </div>
          )}

          {statusCode && (
            <div className="flex justify-between mb-2">
              <span className="text-white/60">Status Code:</span>
              <span>{statusCode}</span>
            </div>
          )}

          <div className="mt-3 bg-red-950/30 border border-red-900/30 rounded p-2 flex items-start">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-red-300 text-xs">{failureReason}</p>
          </div>
        </div>

        {/* Possible Causes */}
        <div className="mb-6">
          <h3 className="font-bold mb-2 border-b border-white/10 pb-1">Kemungkinan Penyebab</h3>
          <ul className="space-y-2 text-sm text-white/80 list-disc pl-5">
            <li>Pembayaran dibatalkan atau ditolak</li>
            <li>Waktu pembayaran telah habis (timeout)</li>
            <li>Masalah koneksi saat memproses pembayaran</li>
            <li>Dana tidak mencukupi</li>
            <li>Metode pembayaran tidak diaktifkan untuk transaksi online</li>
          </ul>
        </div>

        {/* What to do */}
        <div className="mb-8">
          <h3 className="font-bold mb-2 border-b border-white/10 pb-1">
            Apa yang Dapat Dilakukan?
          </h3>
          <ul className="space-y-2 text-sm text-white/80 list-disc pl-5">
            <li>Coba lagi pendaftaran dengan metode pembayaran yang berbeda</li>
            <li>Periksa saldo atau limit pembayaran Anda</li>
            <li>Pastikan metode pembayaran Anda aktif untuk transaksi online</li>
            <li>Hubungi bank atau penyedia dompet digital Anda</li>
            <li>Hubungi dukungan pelanggan kami untuk bantuan</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <Link
            href="dashboard.autolaku.com/auth"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-center flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Coba Daftar Kembali
          </Link>

          <Link
            href="/"
            className="w-full py-3 bg-dark-700 hover:bg-dark-600 text-white/80 font-medium rounded-md text-center flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Home
          </Link>

          <button
            onClick={() =>
              (window.location.href =
                'mailto:support@autolaku.com?subject=Payment%20Failed&body=Transaction%20ID:%20' +
                transactionId)
            }
            className="w-full py-3 bg-dark-700 hover:bg-dark-600 text-white/80 font-medium rounded-md text-center flex items-center justify-center gap-2 mt-2">
            <Mail className="w-4 h-4" /> Hubungi Support
          </button>
        </div>

        {/* Save Transaction ID */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/50 italic">
            Simpan Transaction ID ini sebagai referensi saat menghubungi dukungan pelanggan.
          </p>
        </div>
      </div>
    </div>
  );
}
