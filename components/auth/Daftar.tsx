/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { GrUserAdmin } from 'react-icons/gr';

import Link from 'next/link';

const Daftar = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsappNumber: '',
    role: 'user',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [messageProgress, setMessageProgress] = useState<number>(0);

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

  const handleContinue = () => {
    if (step === 1 && formData.role) {
      setStep(2);
      setError(null);
    } else if (step === 2 && formData.name) {
      setStep(3);
      setError(null);
    } else if (step === 3 && formData.email) {
      // Save prefill to localStorage and signal parent to load CheckoutFlow
      try {
        const prefill = {
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsappNumber,
          timestamp: Date.now(),
          v: 1,
        };
        window.localStorage.setItem('autolaku_prefill_contact', JSON.stringify(prefill));
        // Notify any listeners in the same tab to switch view
        window.dispatchEvent(new Event('autolaku:prefill_saved'));
        startTimer('success', 'Data berhasil disimpan. Membuka halaman Checkout…');
      } catch (e) {
        console.error('Failed to save prefill to localStorage:', e);
        startTimer('error', 'Gagal menyimpan data, mohon coba lagi.');
      }
    } else {
      startTimer('error', 'Please complete the required fields.');
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2); // Go back to name
    } else {
      setStep(1); // Go back to role selection
    }
    setError(null);
  };

  // License-key helpers removed (no longer supported)

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full z-20">
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

        {step < 4 ? (
          <div className="w-full max-w-[350px]">
            {step === 1 && (
              <>
                <div className="mb-10">
                  <div className="flex flex-col gap-3 justify-center w-full">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'user' })}
                      className={`flex flex-col items-start text-start p-5 rounded ${
                        formData.role === 'user'
                          ? 'bg-dark-700 border-white/50 border-[1px] text-white'
                          : 'bg-dark-800 border-[1px] border-white/5 text-white/50'
                      }`}>
                      <span className="flex gap-2 items-center font-bold __gradient_text">
                        <GrUserAdmin className="lg:text-lg text-white" />
                        Akun
                      </span>
                      <p className="text-xs lg:text-sm mt-2">
                        Untuk pemilik bisnis, akun dengan username dan password, manajemen perangkat
                        dan karyawan.
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
                    Lanjutkan
                  </button>
                </div>
              </>
            )}
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
        ) : null}
      </div>
    </>
  );
};

export default Daftar;
