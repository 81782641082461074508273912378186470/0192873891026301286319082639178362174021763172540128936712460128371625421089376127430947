/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { PiCopySimple } from 'react-icons/pi';
import { FaCheck } from 'react-icons/fa';
import { MdDownload } from 'react-icons/md';
import { IoCloseSharp } from 'react-icons/io5';
import { GrLicense, GrUserAdmin } from 'react-icons/gr';
import PlanSelector from '@/components/subscription/PlanSelector';
import PaymentStatus from '@/components/subscription/PaymentStatus';
import { SubscriptionPlan } from '@/types/subscription';

import Link from 'next/link';

const Daftar = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsappNumber: '',
    role: 'user',
    username: '',
    password: '',
    plan: '' as SubscriptionPlan | '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generatedLicenseKey, setGeneratedLicenseKey] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [messageProgress, setMessageProgress] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Pricing information for plans
  const planPrices = {
    starter: 20000,
    basic: 60000,
    pro: 85000,
    enterprise: 100000,
  };

  const startTimer = (messageType: 'error' | 'success', message: string) => {
    if (messageType === 'error') {
      setError(message);
    } else {
      setSuccessMessage(message);
    }
    setMessageProgress(100);
    const timer = setInterval(() => {
      setMessageProgress((prevProgress) => {
        if (prevProgress > 0) {
          return prevProgress - 20; // Decrease by 20% every second for 5 seconds
        } else {
          clearInterval(timer);
          setError(null);
          setSuccessMessage(null);
          return 0;
        }
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setGeneratedLicenseKey(null);

    try {
      setLoading(true);
      if (!formData.name || !formData.email) {
        startTimer('error', 'Name and Email are required');
        return;
      }

      if (formData.role === 'license') {
        // License-only registration (free tier, no payment required)
        const payload: Record<string, any> = {
          name: formData.name,
          email: formData.email,
          whatsappNumber: formData.whatsappNumber,
        };

        const response = await fetch('/api/licenses/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'License registration failed');
        }

        const result = await response.json();
        setName(result.name);

        setGeneratedLicenseKey(result.key);
        startTimer('success', 'License registered successfully! (Requires activation)');
        setShowPopup(true);
      }

      setFormData({
        name: '',
        email: '',
        whatsappNumber: '',
        role: 'user',
        username: '',
        password: '',
        plan: '',
      });
      setStep(1);
    } catch (error: any) {
      console.error('Registration error:', error.message);
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (step === 1 && formData.role) {
      setStep(2);
      setError(null);
    } else if (step === 2 && formData.name) {
      setStep(3);
      setError(null);
    } else if (step === 3 && formData.email) {
      // Validate step 3 fields for admin accounts
      if (formData.role === 'admin') {
        if (!formData.username || !formData.password) {
          startTimer('error', 'Username and password are required.');
          return;
        }
        setStep(4); // Plan selection step
        setError(null);
      } else {
        // For license accounts, continue with normal flow
        handleSubmit(new Event('submit') as any);
      }
    } else if (step === 4 && selectedPlan) {
      setStep(5); // Payment step
      setError(null);
    } else {
      startTimer('error', 'Please complete the required fields.');
    }
  };

  const handleBack = () => {
    if (step === 5) {
      setStep(4); // Go back to plan selection
    } else if (step === 4) {
      setStep(3); // Go back to contact info
    } else if (step === 3) {
      setStep(2); // Go back to name
    } else {
      setStep(1); // Go back to role selection
    }
    setError(null);
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setFormData({ ...formData, plan });
  };

  const handlePaymentComplete = (txId: string, pUrl: string) => {
    setTransactionId(txId);
    setPaymentUrl(pUrl);
    setPaymentStatus('pending');
    // Open payment URL in new tab for user to scan QR code
    window.open(pUrl, '_blank');
  };

  // Handle admin registration with payment
  const handleAdminRegistration = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate all required fields
      if (!formData.name || !formData.email || !formData.username || !formData.password) {
        startTimer('error', 'All fields are required.');
        return;
      }

      if (!selectedPlan) {
        startTimer('error', 'Please select a subscription plan.');
        return;
      }

      // Call the new registration endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          whatsappNumber: formData.whatsappNumber,
          username: formData.username,
          password: formData.password,
          plan: selectedPlan,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      if (result.success && result.payment.paymentUrl) {
        // Payment initiated successfully
        handlePaymentComplete(result.payment.transactionId, result.payment.paymentUrl);
        startTimer(
          'success',
          'Registration initiated! Please complete payment to activate your account.'
        );
      } else {
        throw new Error(result.error || 'Failed to initiate payment');
      }
    } catch (error: any) {
      console.error('Admin registration error:', error.message);

      // Provide user-friendly error messages
      let errorMessage = error.message || 'Registration failed. Please try again.';

      // Check if it's a Faspay infrastructure error
      if (errorMessage.includes('Faspay sandbox is currently experiencing issues')) {
        errorMessage =
          'Sistem pembayaran sedang mengalami gangguan. Silakan coba lagi dalam beberapa saat atau hubungi support.';
      } else if (
        errorMessage.includes('already taken') ||
        errorMessage.includes('already registered')
      ) {
        errorMessage = error.message; // Keep original message for duplicate errors
      }

      startTimer('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLicenseKey) {
      navigator.clipboard.writeText(generatedLicenseKey).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const saveToTextFile = () => {
    if (generatedLicenseKey) {
      const fileContent = `Name: ${name}\nLicense Key: ${generatedLicenseKey}`;
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `Autolaku LicenseKey ${name}`);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full max-w-[350px]">
        {(error || successMessage) && (
          <div>
            <p
              className={`px-3 py-1 ${
                error
                  ? 'text-red-500 bg-red-500/20 text-sm'
                  : 'bg-green-500/20 text-green-500 text-sm'
              }`}>
              {error || successMessage}
            </p>
            <div className="h-0.5 bg-dark-700 absolute bottom-0 left-0 w-full ">
              <div
                className={`h-full ${error ? 'bg-red-500 bg-sm' : 'text-green-500 text-sm'}}`}
                style={{ width: `${messageProgress}%` }}></div>
            </div>
          </div>
        )}
        <div className="w-full">
          {step === 1 && (
            <>
              <div className="mb-10">
                <div className="flex flex-col gap-3 justify-center w-full">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'license' })}
                    className={`flex flex-col items-start text-start p-5 rounded ${
                      formData.role === 'license'
                        ? 'bg-dark-700 border-white/50 border-[1px] text-white'
                        : 'bg-dark-800 border-[1px] border-white/5 text-white/50'
                    }`}>
                    <span className="flex gap-2 items-center font-bold __gradient_text">
                      <GrLicense className="lg:text-lg text-white" />
                      License Key
                    </span>
                    <p className="text-xs lg:text-sm mt-2">
                      Untuk individu, satu perangkat, akses fitur dasar.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`flex flex-col items-start text-start p-5 rounded ${
                      formData.role === 'admin'
                        ? 'bg-dark-700 border-white/50 border-[1px] text-white'
                        : 'bg-dark-800 border-[1px] border-white/5 text-white/50'
                    }`}>
                    <span className="flex gap-2 items-center font-bold __gradient_text">
                      <GrUserAdmin className="lg:text-lg text-white" />
                      Akun
                    </span>
                    <p className="text-xs lg:text-sm mt-2">
                      Untuk pemilik bisnis, akun dengan username dan password, manajemen kunci
                      lisensi dan karyawan.
                    </p>
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleContinue}
                className="bg-white text-sm lg:text-base text-black font-bold py-2 px-4 rounded w-full">
                Lanjutkan Pendaftaran
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-10">
                <label className="block text-gray-300 text-sm font-bold mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  className="__input"
                  placeholder="Tonald Drump"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-dark-700 text-sm lg:text-base text-white font-bold py-2 px-4 rounded">
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="bg-white text-sm lg:text-base text-black font-bold py-2 px-4 rounded ">
                  Lanjutkan Pendaftaran
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-5">
                <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  className="__input"
                  placeholder="tonalddrump01@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-10">
                <label className=" text-gray-300 text-sm font-bold mb-2">
                  <p className="text-xs text-white/70">* Awalan 62</p>
                  WhatsApp Number
                </label>
                <input
                  type="number"
                  className="__input [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="628123456789"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                />
              </div>

              {formData.role === 'admin' && (
                <>
                  <div className="mb-10">
                    <label className="block text-gray-300 text-sm font-bold mb-2">Username</label>
                    <input
                      type="text"
                      className="__input"
                      placeholder="drumptonald01"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-10">
                    <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                    <input
                      type="password"
                      className="__input"
                      placeholder="t0n4LdDrump01"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-dark-700 text-sm lg:text-base text-white font-bold py-2 px-4 rounded">
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="bg-white text-sm lg:text-base text-black font-bold py-2 px-4 rounded">
                  {formData.role === 'admin' ? 'Lanjutkan' : 'Daftar Sekarang'}
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <PlanSelector selectedPlan={selectedPlan} onSelectPlan={handleSelectPlan} />

              <div className="flex items-center justify-between w-full mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-dark-700 text-sm lg:text-base text-white font-bold py-2 px-4 rounded">
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="bg-white text-sm lg:text-base text-black font-bold py-2 px-4 rounded">
                  Lanjutkan ke Pembayaran
                </button>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              {paymentStatus === null && selectedPlan && (
                <div className="w-full space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Pembayaran QRIS</h2>
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm text-white/70 hover:text-white">
                      ← Kembali ke Paket
                    </button>
                  </div>

                  <div className="bg-dark-800 border border-white/10 rounded-lg p-5 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold __gradient_text">
                        Paket {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                      </h3>
                      <div className="text-right">
                        <span className="text-lg font-bold">
                          IDR {planPrices[selectedPlan].toLocaleString()}
                        </span>
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
                    <div className="bg-red-500/20 text-red-500 p-3 rounded-md text-sm">{error}</div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-white/70 mb-4">
                      Dengan melanjutkan pembayaran, Anda menyetujui Syarat & Ketentuan dan
                      Kebijakan Privasi kami. Langganan Anda akan diperpanjang otomatis setiap bulan
                      hingga dibatalkan.
                    </p>

                    <button
                      type="button"
                      onClick={handleAdminRegistration}
                      disabled={loading}
                      className={`w-full py-3 rounded-md font-bold ${
                        loading
                          ? 'bg-dark-600 text-white/50 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-white/90'
                      }`}>
                      {loading
                        ? 'Memproses...'
                        : `Bayar dengan QRIS - IDR ${planPrices[selectedPlan].toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}

              {paymentStatus && (
                <PaymentStatus
                  status={paymentStatus}
                  transactionId={transactionId || undefined}
                  paymentUrl={paymentUrl || undefined}
                />
              )}
            </>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-10 text-center">
          Dengan mendaftar, Anda setuju dengan{' '}
          <Link
            target="_blank"
            href="https://autolaku.com/ketentuan-layanan"
            className="text-blue-400">
            Ketentuan Layanan
          </Link>{' '}
          dan{' '}
          <Link
            target="_blank"
            href="https://autolaku.com/kebijakan-privasi"
            className="text-blue-400">
            Kebijakan Privasi
          </Link>
        </p>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm shadow-xl shadow-black flex items-center justify-center z-50">
          <div className="bg-dark-800 border-[1px] border-white/10 p-6 roundelg shadow-lg w-full max-w-md text-star t">
            <div className=" w-full flex justify-between items-start mb-10">
              <h3 className="text-xl font-bold text-white">Pendaftaran Berhasil!</h3>
              <button
                onClick={closePopup}
                className="bg-dark-600 hover:bg-dark-500! border-[1px] border-white/10 rounded-[5px] p-2 text-white font-bold items-center">
                <IoCloseSharp className="text-xl" />
              </button>
            </div>
            <p className="text-white/80 text-sm mb-2">
              Silakan simpan kunci lisensi Anda dengan aman. Jangan sampai hilang atau lupa
            </p>
            <p className="text-white/50 text-xs mb-2">
              Anda dapat menyimpannya dengan tombol unduh, dan kunci lisensi tersebut akan disimpan
              di komputer Anda sebagai cadangan jika Anda lupa.
            </p>
            <p className="text-amber-500/80 text-xs mb-5 font-medium">
              Catatan: Kunci lisensi ini belum aktif. Silakan hubungi admin untuk mengaktifkan
              lisensi Anda.
            </p>
            <div className="mb-5 mt-10">
              {generatedLicenseKey && (
                <div>
                  <p className="text-white/40 text-sm mb-1">License Key</p>
                  <div className="flex items-center justify-between px-2 border-[1px] border-white/10 rounded-[5px] shadow-md bg-dark-700">
                    <p className="font-bold start">{generatedLicenseKey} </p>
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={copyToClipboard} className="text-white">
                        {copied ? <FaCheck /> : <PiCopySimple />}
                      </button>
                      <div className="h-8 w-[1px] bg-white/20" />
                      <button onClick={saveToTextFile} className="text-white ">
                        <MdDownload className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Daftar;
