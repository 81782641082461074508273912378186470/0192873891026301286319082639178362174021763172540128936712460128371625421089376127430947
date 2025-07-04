/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { PiCopySimple } from 'react-icons/pi';
import { FaCheck } from 'react-icons/fa';
import { MdDownload } from 'react-icons/md';
import { IoCloseSharp } from 'react-icons/io5';
import { GrLicense, GrUserAdmin } from 'react-icons/gr';

import Link from 'next/link';

const Daftar = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsappNumber: '',
    role: 'user',
    username: '',
    password: '',
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
        startTimer('success', 'License registered successfully!');
        setShowPopup(true);
      } else {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            whatsappNumber: formData.whatsappNumber,
            username: formData.username,
            password: formData.password,
            role: formData.role,
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'User registration failed');
        }

        startTimer('success', 'Admin registered successfully!');
      }

      setFormData({
        name: '',
        email: '',
        whatsappNumber: '',
        role: 'user',
        username: '',
        password: '',
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
    } else {
      startTimer('error', 'Please complete the required fields.');
    }
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
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
                  onClick={handleSubmit}
                  className={`text-sm lg:text-base font-bold py-2 px-4 rounded ${
                    loading ? 'bg-dark-600 text-white' : 'bg-white text-black'
                  }`}
                  disabled={loading}>
                  {loading ? 'Mohon Tunggu..' : 'Daftar Sekarang'}
                </button>
              </div>
            </>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-10 text-center">
          Dengan mendaftar, Anda setuju dengan{' '}
          <Link href="/ketentuan-layanan" className="text-blue-400">
            Ketentuan Layanan
          </Link>{' '}
          dan{' '}
          <Link href="kebijakan-privasi" className="text-blue-400">
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
            <p className="text-white/50 text-xs mb-5">
              Anda dapat menyimpannya dengan tombol unduh, dan kunci lisensi tersebut akan disimpan
              di komputer Anda sebagai cadangan jika Anda lupa.
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
