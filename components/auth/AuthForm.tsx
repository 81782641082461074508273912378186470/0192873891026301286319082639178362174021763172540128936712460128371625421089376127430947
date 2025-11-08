/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Login from './Login';
import Daftar from './Daftar';
import { useSearchParams } from 'next/navigation';
import CheckoutFlow from '@/components/checkout/CheckoutFlow';

const AuthForm = () => {
  const [activeSection, setActiveSection] = useState<'login' | 'daftar'>('login');
  const searchParams = useSearchParams();
  const [showCheckout, setShowCheckout] = useState(false);

  const planFromQuery = useMemo(() => searchParams.get('plan'), [searchParams]);
  const isPaymentFirst = useMemo(
    () => searchParams.get('flow') === 'payment-first' && !!planFromQuery,
    [searchParams, planFromQuery]
  );

  const getPrefillFromStorage = () => {
    try {
      const raw =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('autolaku_prefill_contact')
          : null;
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Expire after 1 hour
      if (parsed?.timestamp && Date.now() - parsed.timestamp > 60 * 60 * 1000) {
        window.localStorage.removeItem('autolaku_prefill_contact');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // Auto-open Daftar for payment-first or when prefill exists
    const prefill = getPrefillFromStorage();
    if (isPaymentFirst || prefill) {
      setActiveSection('daftar');
      setShowCheckout(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'autolaku_prefill_contact') {
        const prefill = getPrefillFromStorage();
        if (prefill) {
          setActiveSection('daftar');
          setShowCheckout(true);
        }
      }
    };
    const onCustom = () => {
      const prefill = getPrefillFromStorage();
      if (prefill) {
        setActiveSection('daftar');
        setShowCheckout(true);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
      window.addEventListener('autolaku:prefill_saved', onCustom as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage);
        window.removeEventListener('autolaku:prefill_saved', onCustom as EventListener);
      }
    };
  }, []);

  const toggleSection = (section: 'login' | 'daftar') => {
    setActiveSection(section);
    // Reset checkout mode when switching tabs
    if (section === 'login') {
      setShowCheckout(false);
    } else {
      // Re-evaluate on switching back to daftar
      const prefill = getPrefillFromStorage();
      setShowCheckout(!!prefill || isPaymentFirst);
    }
  };
  const isCheckoutView = activeSection === 'daftar' && showCheckout;
  return (
    <div className="flex w-full h-fit min-h-[75vh]">
      <div className="w-full flex flex-col justify-start border-[1px] xl:border-r-0 border-white/10 ">
        {!isCheckoutView && (
          <div className="flex flex-col w-full h-fit items-center justify-center">
            <div className="flex w-full items-center justify-between">
              <div className="w-10 h-10 " />
              <div className="flex w-full h-10 justify-center items-center border-[1px] border-y-0 border-white/10">
                <h2 className="font-semibold text-sm lg:text-base text-center">
                  {activeSection === 'daftar'
                    ? 'Dropshipping Efisien mulai dari sini.'
                    : 'Lanjutkan perjalanan dropshipping Anda di sini.'}
                </h2>
              </div>
              <div className="w-10 h-10 " />
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="w-10 h-10 border-y-[1px] border-white/10" />
              <div className="flex w-full h-10 justify-center items-center border-[1px] border-white/10">
                <p className="font-extralight text-center text-white/70 text-xs lg:text-sm">
                  {activeSection === 'daftar'
                    ? 'Daftar Sekarang!'
                    : 'Masuk untuk melanjutkan keberhasilan Anda.'}
                </p>
              </div>
              <div className="w-10 h-10 border-y-[1px] border-white/10" />
            </div>
          </div>
        )}

        <div className="h-full gap-10 flex flex-col justify-center items-center px-10 relative w-full">
          {!isCheckoutView && (
            <button
              onClick={() => toggleSection(activeSection === 'daftar' ? 'login' : 'daftar')}
              className="absolute top-0 right-0 m-5 px-4 py-2 hover:bg-white/10 rounded-[5px] border-[0.5px] border-white/20">
              {activeSection === 'daftar' ? 'Masuk' : 'Daftar'}
            </button>
          )}
          {activeSection === 'login' ? (
            <Login />
          ) : showCheckout ? (
            <div className="w-full py-10 z-20">
              <CheckoutFlow
                initialIntent={
                  isPaymentFirst && planFromQuery
                    ? { type: 'subscription', planId: planFromQuery as any }
                    : { type: 'subscription' }
                }
              />
            </div>
          ) : (
            <Daftar />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
