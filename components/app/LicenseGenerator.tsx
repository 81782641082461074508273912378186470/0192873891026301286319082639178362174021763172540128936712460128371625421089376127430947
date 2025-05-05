'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { generateLicense } from '@/lib/utils';
import { useAuth } from '@/context/AuthDashboardContext';
import { PiCopySimple } from 'react-icons/pi';
import { FaCheck } from 'react-icons/fa';
import { MdDownload } from 'react-icons/md';
import { IoCloseSharp } from 'react-icons/io5';
import { saveAs } from 'file-saver';

interface FormData {
  name: string;
  whatsappNumber: string;
  email: string;
}

const LicenseGenerator: React.FC = () => {
  const { user, authDetails } = useAuth();
  const licenseLimit = user?.licenseLimit || 0;
  console.log('user |  LicenseGenerator.tsx', user);
  const [formData, setFormData] = useState<FormData>({ name: '', whatsappNumber: '', email: '' });
  const [generatedLicense, setGeneratedLicense] = useState<{ name: string; key: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [messageProgress, setMessageProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
          return prevProgress - 20;
        } else {
          clearInterval(timer);
          setError(null);
          setSuccessMessage(null);
          return 0;
        }
      });
    }, 1000);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateLicenses = async () => {
    setError(null);
    setSuccessMessage(null);
    setGeneratedLicense(null);

    const token = authDetails?.token;
    if (!token) {
      startTimer('error', 'Authentication token not found');
      return;
    }

    try {
      setLoading(true);
      if (!formData.name || !formData.whatsappNumber || !formData.email) {
        throw new Error('Isi Data Dengan Lengkap');
      }
      const key = await generateLicense(
        token,
        formData.name,
        formData.whatsappNumber,
        formData.email
      );
      setGeneratedLicense({ name: formData.name, key });
      setShowPopup(true);
    } catch (err) {
      startTimer('error', (err as Error).message || 'Failed to generate license');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (key: string, index: number) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const saveToTextFile = (name: string, key: string) => {
    const fileContent = `Name: ${name}\nLicense Key: ${key}`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Autolaku LicenseKey ${name}.txt`);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  console.log('licenseLimit |  LicenseGenerator.tsx', licenseLimit);
  return (
    <div className="w-full max-w-[350px] p-5 border-[1px] border-white/20">
      <h2 className="text-white text-center text-lg font-bold pb-5 mb-5 border-b-[1px] border-white/20 __gradient_text">
        Generate License Key
      </h2>
      {(error || successMessage) && (
        <div className="mb-5">
          <p
            className={`px-3 py-1 w-full text-center ${
              error
                ? 'text-red-500 bg-red-500/20 text-sm'
                : 'bg-green-500/20 text-green-500 text-sm'
            }`}>
            {error || successMessage}
          </p>
          <div className="h-0.5 bg-dark-700 w-full relative">
            <div
              className={`h-full ${error ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${messageProgress}%` }}></div>
          </div>
        </div>
      )}
      <div className="mb-5">
        <label className="block text-gray-300 text-sm font-bold mb-2">Nama Lengkap</label>
        <input
          required
          type="text"
          placeholder="Tonald Drump"
          className="__input"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-300 text-sm font-bold mb-2">
          <p className="text-xs text-white/70 font-light">* Awalan 62</p>
          No WhatsApp
        </label>
        <input
          required
          type="number"
          placeholder="628123456789"
          className="__input [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={formData.whatsappNumber}
          onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
        <input
          required
          type="email"
          placeholder="nama@contoh.com"
          className="__input"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
      </div>
      <button
        onClick={handleGenerateLicenses}
        className={`font-bold py-2 px-4 rounded w-full ${
          loading ? 'bg-dark-600 text-white opacity-50 cursor-loading' : 'bg-white text-black'
        }`}
        disabled={loading}>
        {loading ? 'Mohon Tunggu...' : 'Generate'}
      </button>
      {showPopup && generatedLicense && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm shadow-xl shadow-black flex items-center justify-center z-50">
          <div className="bg-dark-800 border-[1px] border-white/10 p-6 rounded-lg shadow-lg w-full max-w-md text-start">
            <div className="w-full flex justify-between items-start mb-10">
              <h3 className="__gradient_text font-bold text-white">License Key Berhasil Dibuat!</h3>
              <button
                onClick={closePopup}
                className="bg-dark-600 hover:bg-dark-500 border-[1px] border-white/10 rounded-[5px] p-2 text-white font-bold items-center">
                <IoCloseSharp className="text-xl" />
              </button>
            </div>
            <p className="text-white/80 text-sm mb-2">
              Silakan simpan kunci lisensi Anda dengan aman. Jangan sampai hilang atau lupa.
            </p>
            <p className="text-white/50 text-xs mb-5">
              Anda dapat menyimpannya dengan tombol unduh, dan kunci lisensi tersebut akan disimpan
              di komputer Anda sebagai cadangan jika Anda lupa.
            </p>
            <div className="mb-5 mt-10">
              <div className="mb-4">
                <p className="text-white/40 text-sm mb-1">Name: {generatedLicense.name}</p>
                <p className="text-white/40 text-sm mb-1">License Key</p>
                <div className="flex items-center justify-between px-2 border-[1px] border-white/10 rounded-[5px] shadow-md bg-dark-700">
                  <p className="font-bold">{generatedLicense.key}</p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => copyToClipboard(generatedLicense.key, 0)}
                      className="text-white">
                      {copiedIndex === 0 ? <FaCheck /> : <PiCopySimple />}
                    </button>
                    <div className="h-8 w-[1px] bg-white/20" />
                    <button
                      onClick={() => saveToTextFile(generatedLicense.name, generatedLicense.key)}
                      className="text-white">
                      <MdDownload className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseGenerator;
