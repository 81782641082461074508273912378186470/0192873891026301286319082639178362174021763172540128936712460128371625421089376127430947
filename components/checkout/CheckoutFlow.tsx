'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PlanSelector from '@/components/subscription/PlanSelector';
import { SubscriptionPlan } from '@/types/subscription';
import { pricingCatalog } from '@/components/subscription/PlanSelector';
import { Button } from '@/components/ui/button';
import PaymentStatus from '@/components/subscription/PaymentStatus';
import { CheckCircleIcon, X } from 'lucide-react';

type Step = 'plan' | 'review' | 'pending';

type FeatureLike = { name: string; included: boolean };

interface CheckoutFlowProps {
  initialIntent?: {
    type: 'subscription' | 'satuan';
    planId?: SubscriptionPlan;
    billingCycle?: 'monthly' | 'annual';
    // satuanConfig?: any; // future extension
  };
  prefillContact?: { name?: string; email?: string; whatsapp?: string };
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ initialIntent, prefillContact }) => {
  const searchParams = useSearchParams();

  const inferredIntent = useMemo(() => {
    const flow = searchParams.get('flow');
    const planParam = searchParams.get('plan') as SubscriptionPlan | null;
    if (flow === 'payment-first' && planParam) {
      return { type: 'subscription' as const, planId: planParam, billingCycle: 'monthly' as const };
    }
    return initialIntent || { type: 'subscription' as const };
  }, [searchParams, initialIntent]);

  const [step, setStep] = useState<Step>('plan');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    inferredIntent.planId || null
  );
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'annual'>(
    inferredIntent.billingCycle || 'monthly'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingTx, setPendingTx] = useState<{ id: string; url?: string } | null>(null);
  const [editingContact, setEditingContact] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSnapshot, setContactSnapshot] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  useEffect(() => {
    if (inferredIntent.billingCycle) {
      setSelectedCycle(inferredIntent.billingCycle);
    }
    if (inferredIntent.planId) {
      setStep('review');
    } else if (!selectedPlan) {
      setStep('plan');
    }
  }, [inferredIntent.planId, inferredIntent.billingCycle, selectedPlan]);

  // Apply prefill for contact details once
  useEffect(() => {
    if (!prefillContact) return;
    if (!name && prefillContact.name) setName(prefillContact.name);
    if (!email && prefillContact.email) setEmail(prefillContact.email);
    if (!whatsapp && prefillContact.whatsapp) setWhatsapp(prefillContact.whatsapp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillContact]);

  // Also read prefill from localStorage if not provided via props
  useEffect(() => {
    if (prefillContact) return; // already handled above
    try {
      const raw =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('autolaku_prefill_contact')
          : null;
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // Expire after 1 hour
      if (parsed?.timestamp && Date.now() - parsed.timestamp > 60 * 60 * 1000) {
        window.localStorage.removeItem('autolaku_prefill_contact');
        return;
      }
      if (!name && parsed?.name) setName(parsed.name);
      if (!email && parsed?.email) setEmail(parsed.email);
      if (!whatsapp && parsed?.whatsapp) setWhatsapp(parsed.whatsapp);
    } catch {
      // ignore invalid storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPlanMeta = useMemo(() => {
    if (!selectedPlan) return null;
    const entry =
      selectedPlan !== 'enterprise'
        ? pricingCatalog[selectedPlan as 'starter' | 'basic' | 'pro']
        : undefined;
    if (!entry) return null;
    const cycle = selectedCycle;
    const featuresRaw = (entry.features?.[cycle] as unknown as FeatureLike[] | undefined)?.map(
      (feature) => ({ ...feature })
    );
    const features: FeatureLike[] = [
      { name: `${entry.devices} Perangkat`, included: true },
      ...(featuresRaw ?? []),
    ];
    const monthlyTotal = entry.monthlyPrice * 12;
    const annualSavings = Math.max(0, monthlyTotal - entry.annualPrice);
    const savingsPercent = monthlyTotal > 0 ? Math.round((annualSavings / monthlyTotal) * 100) : 0;
    const perKeyMonthly = Math.round(entry.monthlyPrice / entry.devices / 1000);
    const perKeyAnnual = Math.round(entry.annualPrice / (entry.devices * 12) / 1000);
    return {
      planId: selectedPlan,
      title: entry.title,
      cycle,
      price: cycle === 'annual' ? entry.annualPrice : entry.monthlyPrice,
      monthlyPrice: entry.monthlyPrice,
      annualPrice: entry.annualPrice,
      monthlyTotal,
      annualSavings,
      savingsPercent,
      devices: entry.devices,
      licenseLimit: entry.licenseLimit,
      perKeyMonthly,
      perKeyAnnual,
      features,
    };
  }, [selectedPlan, selectedCycle]);

  const formatIDR = (amount: number) => `Rp ${amount.toLocaleString('id-ID')} `;

  const syncPrefillContact = (payload: { name: string; email: string; whatsapp?: string }) => {
    try {
      window.localStorage.setItem(
        'autolaku_prefill_contact',
        JSON.stringify({
          ...payload,
          timestamp: Date.now(),
          v: 1,
        })
      );
    } catch {
      // ignore storage errors
    }
  };

  const proceedToReview = () => {
    if (!selectedPlan) {
      setError('Silakan pilih paket.');
      return;
    }
    setError(null);
    setContactError(null);
    if (!name || !email) {
      handleEditContact();
    } else {
      setEditingContact(false);
    }
    setStep('review');
  };

  const handleEditContact = () => {
    setContactSnapshot({
      name,
      email,
      whatsapp,
    });
    setContactError(null);
    setEditingContact(true);
  };

  const handleCancelEditContact = () => {
    setName(contactSnapshot.name);
    setEmail(contactSnapshot.email);
    setWhatsapp(contactSnapshot.whatsapp);
    setContactError(null);
    setEditingContact(false);
  };

  const handleSaveContact = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) {
      setContactError('Nama dan email wajib diisi.');
      return;
    }
    setName(trimmedName);
    setEmail(trimmedEmail);
    syncPrefillContact({ name: trimmedName, email: trimmedEmail, whatsapp });
    setContactError(null);
    setEditingContact(false);
  };

  const handleStartPayment = async () => {
    try {
      setError(null);
      setContactError(null);
      if (!selectedPlan) {
        setError('Silakan pilih paket.');
        return;
      }
      if (!name || !email) {
        handleEditContact();
        setContactError('Nama dan email wajib diisi.');
        return;
      }
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          whatsappNumber: whatsapp || undefined,
          plan: selectedPlan,
          billingCycle: selectedCycle,
          paymentMethod: 'shopeepay_qris',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success || !data?.payment?.paymentUrl) {
        throw new Error(data?.error || 'Gagal memulai pembayaran');
      }
      try {
        const pending = {
          userId: data.user?.id,
          transactionId: data.payment?.transactionId,
          email: data.user?.email,
          plan: selectedPlan,
          billingCycle: selectedCycle,
          name: data.user?.name,
        };
        window.localStorage.setItem('autolaku_pending_registration', JSON.stringify(pending));
      } catch {}
      setPendingTx({ id: data.payment.transactionId, url: data.payment.paymentUrl });
      setStep('pending');
      // Clear prefill contact once payment has been initiated
      try {
        window.localStorage.removeItem('autolaku_prefill_contact');
      } catch {}
      window.open(data.payment.paymentUrl, '_blank');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Terjadi kesalahan saat memulai pembayaran';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5  z-20">
      {step === 'plan' && (
        <div className="w-full">
          <PlanSelector
            selectedPlan={selectedPlan}
            onSelectPlan={(p) => setSelectedPlan(p)}
            billingCycle={selectedCycle}
            onCycleChange={(cycle) => setSelectedCycle(cycle)}
            ctaMode="select"
            paymentFirst={false}
            ignoreQueryFlow
          />
          {error && step === 'plan' && <div className="text-xs text-red-400 mt-2">{error}</div>}
          <div className="mt-4 flex justify-end">
            <Button
              disabled={!selectedPlan}
              onClick={proceedToReview}
              className="bg-white text-black">
              Lanjutkan
            </Button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="w-full space-y-4">
          <div className="rounded-lg border border-dark-750 bg-gradient-to-bl from-dark-800 via-dark-900 to-black p-3 text-sm text-white/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white">Data Kontak</div>
                <p className="text-xs text-white/50">
                  Pastikan informasi berikut benar sebelum melanjutkan pembayaran.
                </p>
              </div>
              {editingContact ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEditContact}
                    className="bg-dark-700 text-xs text-white font-semibold py-1 px-3 rounded">
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveContact}
                    className="bg-white text-xs text-black font-semibold py-1 px-3 rounded">
                    Simpan
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEditContact}
                  className="text-xs text-white/70 hover:text-white underline underline-offset-4">
                  Ubah
                </button>
              )}
            </div>
            {editingContact ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="__input"
                    placeholder="Tonald Drump"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    className="__input"
                    placeholder="tonalddrump01@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1">
                    <span className="text-white/70 block text-[11px]">* Awalan 62</span>
                    WhatsApp Number
                  </label>
                  <input
                    type="number"
                    className="__input [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="628123456789"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <ul className="space-y-1">
                <li>• Nama: {name || '-'}</li>
                <li>• Email: {email || '-'}</li>
                <li>• WhatsApp: {whatsapp || '-'}</li>
              </ul>
            )}
            {contactError && <div className="text-xs text-red-400">{contactError}</div>}
          </div>
          {selectedPlanMeta ? (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="group space-y-3 relative flex flex-col border bg-dark-900 p-3 border-t-4 border-t-white border-white/10">
                  <header className="space-y-3 text-center">
                    <h3 className="text-2xl font-semibold tracking-widest text-white p-1 border bg-black border-white/10">
                      {selectedPlanMeta.title}
                    </h3>
                    <div className="flex flex-row items-center justify-between px-3 py-1 bg-dark-750">
                      <h3 className="text-3xl font-bold text-white flex items-start justify-start gap-1 relative">
                        <span className="text-sm text-white/50">Rp</span>
                        {Math.round(selectedPlanMeta.price / 1000)}K
                        {selectedPlanMeta.cycle === 'annual' ? (
                          <span className="line-through tracking-normal absolute bottom-0 -right-2/5 px-1 py-0.5 text-red-500 text-xs flex w-fit">
                            {Math.round(selectedPlanMeta.monthlyTotal / 1000)}K
                          </span>
                        ) : (
                          selectedPlan === 'pro' && (
                            <span className="line-through tracking-normal absolute bottom-0 -right-1/2 px-1 py-0.5 text-red-500 text-xs flex w-fit">
                              {Math.round(selectedPlanMeta.monthlyTotal / 1000)}K
                            </span>
                          )
                        )}
                      </h3>
                      <div className="text-xs uppercase text-white/80 font-semibold">
                        / {selectedPlanMeta.cycle === 'annual' ? 'tahun' : 'bulan'}
                      </div>
                    </div>
                  </header>

                  <div className="border border-dark-750 bg-gradient-to-bl from-dark-800 via-dark-900 to-black p-3 space-y-2">
                    <div className="text-xs uppercase text-white/60 font-semibold">
                      Detail Paket
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-3 text-white/85">
                        <CheckCircleIcon className="h-4 w-4 text-white" />
                        <span>{selectedPlanMeta.devices} Perangkat</span>
                      </li>
                      <li className="flex items-center gap-3 text-white/85">
                        <CheckCircleIcon className="h-4 w-4 text-white" />
                        <span>Batas Lisensi {selectedPlanMeta.licenseLimit}</span>
                      </li>
                      <li className="flex items-center gap-3 text-white/85">
                        <CheckCircleIcon className="h-4 w-4 text-white" />
                        <span>
                          Siklus Tagihan{' '}
                          {selectedPlanMeta.cycle === 'annual' ? 'Tahunan' : 'Bulanan'}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-dark-750 bg-gradient-to-bl from-dark-800 via-dark-900 to-black p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-white text-sm">
                        <div className="text-[11px] uppercase text-white/70 font-semibold">
                          Ringkasan Pesanan
                        </div>
                        <div className="uppercase font-semibold __gradient_text">
                          {selectedPlanMeta?.title || '-'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {selectedPlanMeta
                            ? `${formatIDR(selectedPlanMeta.price)}/ ${
                                selectedPlanMeta.cycle === 'annual' ? 'tahun' : 'bulan'
                              }`
                            : '-'}
                        </div>
                        <div className="text-[11px] text-white/50">
                          {selectedPlanMeta?.cycle === 'annual'
                            ? 'Tagihan tahunan (hemat hingga 20%)'
                            : 'Tagihan per bulan'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="border border-dark-750 bg-gradient-to-bl from-dark-800 via-dark-900 to-black p-3 space-y-2">
                    <div className="text-xs uppercase text-white/60 font-semibold">
                      Fitur Termasuk
                    </div>
                    <ul className="space-y-2 text-sm">
                      {selectedPlanMeta.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className={`flex items-center gap-3 ${
                            feature.included ? 'text-white/85' : 'text-white/30 line-through'
                          }`}>
                          {feature.included ? (
                            <CheckCircleIcon className="h-4 w-4 text-white" />
                          ) : (
                            <X className="h-4 w-4 text-white/30" />
                          )}
                          <span>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="border border-dark-750 bg-gradient-to-bl from-dark-800 via-dark-900 to-black p-3 space-y-2">
                <div className="text-xs uppercase text-white/60 font-semibold">Rincian Biaya</div>
                <div className="flex items-center justify-between text-white/80 text-sm border-b border-white/10 pb-2">
                  <span>Paket {selectedPlanMeta.title}</span>
                  <span>
                    {formatIDR(selectedPlanMeta.price)}/{' '}
                    {selectedPlanMeta.cycle === 'annual' ? 'tahun' : 'bulan'}
                  </span>
                </div>

                {selectedPlanMeta.cycle === 'annual' ? (
                  <div className="flex flex-wrap items-center justify-start gap-2 text-[11px] pt-1">
                    <span className="border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-semibold text-sky-500">
                      2 bulan gratis
                    </span>
                    <span className="border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-sky-500">
                      Hemat {selectedPlanMeta.savingsPercent}%
                    </span>
                    <span className="border border-white/20 bg-white/10 px-3 py-1 text-white/70">
                      Terhitung Rp {selectedPlanMeta.perKeyAnnual}K /Key
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-start pt-1">
                    <span className="border border-white/20 bg-white/10 px-3 py-1 text-white/70 text-[11px]">
                      Terhitung Rp {selectedPlanMeta.perKeyMonthly}K /Key
                    </span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 flex items-center justify-between text-white font-semibold">
                  <span>Total Dibayar Sekarang</span>
                  <span>{formatIDR(selectedPlanMeta.price)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-white/60">Paket tidak ditemukan</div>
          )}

          {error && <div className="text-xs text-red-400">{error}</div>}
          <div className="flex justify-between">
            <Button
              variant="default"
              className="bg-dark-100 text-white"
              onClick={() => {
                setEditingContact(false);
                setContactError(null);
                setStep('plan');
              }}>
              Kembali
            </Button>
            <Button className="bg-white text-black" onClick={handleStartPayment} disabled={loading}>
              {loading ? 'Memproses…' : 'Bayar dengan QRIS'}
            </Button>
          </div>
        </div>
      )}

      {step === 'pending' && pendingTx && (
        <div className="w-full">
          <PaymentStatus status="pending" transactionId={pendingTx.id} paymentUrl={pendingTx.url} />
        </div>
      )}
    </div>
  );
};

export default CheckoutFlow;
