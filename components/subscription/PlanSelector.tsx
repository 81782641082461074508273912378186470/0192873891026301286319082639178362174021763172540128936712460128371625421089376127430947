/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircleIcon, X, Check } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BsBuildings } from 'react-icons/bs';
import { ADotted } from '@/constans';
import { FaRegLightbulb } from 'react-icons/fa';
import { GrLicense } from 'react-icons/gr';
import { useSearchParams } from 'next/navigation';
import PaymentStatus from '@/components/subscription/PaymentStatus';

export type BillingCycle = 'monthly' | 'annual';
export type PlanId = 'starter' | 'basic' | 'pro';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PlanDetails {
  title: string;
  description: Record<BillingCycle, string>;
  features: Record<BillingCycle, PlanFeature[]>;
  licenseLimit: number;
  devices: number;
  monthlyPrice: number;
  annualPrice: number;
  cta: string;
}

interface PlanSelectorProps {
  selectedPlan: SubscriptionPlan | null;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  billingCycle?: BillingCycle;
  onCycleChange?: (cycle: BillingCycle) => void;
  ctaMode?: 'link' | 'select';
  paymentFirst?: boolean;
  ignoreQueryFlow?: boolean;
  onPurchaseSatuan?: (payload: {
    seatCount: number;
    months: number;
    scrapeTier: '500' | '1000' | '2000' | 'unlimited';
    features: string[];
    totalPrice: number;
  }) => void;
}

export const pricingCatalog: Record<PlanId, PlanDetails> = {
  starter: {
    title: 'Starter',
    description: {
      monthly:
        'Paket bulanan untuk mulai. Tambahkan fitur premium kapan saja jika Anda butuh lebih banyak kapabilitas.',
      annual: 'Langganan tahunan dengan harga hemat dan sudah termasuk semua fitur premium.',
    },
    licenseLimit: 5,
    devices: 5,
    monthlyPrice: 249_000,
    annualPrice: 2_399_000,
    cta: '/daftar?plan=starter&flow=payment-first',
    features: {
      monthly: [
        { name: 'Search Produk Tidak Terbatas', included: true },
        { name: 'Upload Produk Tidak Terbatas', included: true },
        { name: 'Scrape Detail Produk 500 /Hari', included: true },
        { name: 'Filter Kata/Kalimat', included: true },
        { name: 'Atur Keuntungan', included: true },
        { name: 'Frame Gambar Produk', included: false },
        { name: 'AI Optimasi Judul Produk', included: false },
        { name: 'AI Optimasi Deskripsi Produk', included: false },
        { name: 'Data Backup', included: false },
        { name: 'Priority Support', included: false },
      ],
      annual: [
        { name: 'Search Produk Tidak Terbatas', included: true },
        { name: 'Upload Produk Tidak Terbatas', included: true },
        { name: 'Scrape Detail Produk Tak Terbatas', included: true },
        { name: 'Data Backup', included: true },
        { name: 'Priority Support', included: true },
        { name: 'AI Optimasi Judul Produk', included: true },
        { name: 'AI Optimasi Deskripsi Produk', included: true },
        { name: 'Frame Gambar Produk', included: true },
        { name: 'Filter Kata/Kalimat', included: true },
        { name: 'Atur Keuntungan', included: true },
      ],
    },
  },
  basic: {
    title: 'Basic',
    description: {
      monthly:
        'Paket untuk tumbuh dengan AI. Anda bisa menambahkan fitur premium lain yang belum termasuk.',
      annual: 'Langganan tahunan dengan harga hemat dan sudah termasuk semua fitur premium.',
    },
    licenseLimit: 10,
    devices: 10,
    monthlyPrice: 399_000,
    annualPrice: 3_799_000,
    cta: '/daftar?plan=basic&flow=payment-first',
    features: {
      monthly: [
        { name: 'Search Produk Tidak Terbatas', included: true },
        { name: 'Scrape Detail Produk 1.000 /Hari', included: true },
        { name: 'Upload Produk Tidak Terbatas', included: true },
        { name: 'Atur Keuntungan', included: true },
        { name: 'Filter Kata/Kalimat', included: true },
        { name: 'AI Optimasi Judul Produk', included: true },
        { name: 'AI Optimasi Deskripsi Produk', included: true },
        { name: 'Data Backup', included: false },
        { name: 'Priority Support', included: false },
      ],
      annual: [
        { name: 'Search Produk Tidak Terbatas', included: true },
        { name: 'Upload Produk Tidak Terbatas', included: true },
        { name: 'Scrape Detail Produk Tak Terbatas', included: true },
        { name: 'AI Optimasi Judul Produk', included: true },
        { name: 'AI Optimasi Deskripsi Produk', included: true },
        { name: 'Data Backup', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Frame Gambar Produk', included: true },
        { name: 'Filter Kata/Kalimat', included: true },
        { name: 'Atur Keuntungan', included: true },
      ],
    },
  },
  pro: {
    title: 'Pro',
    description: {
      monthly:
        'Paket Pro siap pakai dengan fitur lengkap. Add-on premium bisa ditambahkan jika Anda ingin opsi lanjutan.',
      annual: 'Langganan tahunan dengan harga hemat dan sudah termasuk semua fitur premium.',
    },
    licenseLimit: 50,
    devices: 50,
    monthlyPrice: 1_499_000,
    annualPrice: 13_999_000,
    cta: '/daftar?plan=pro&flow=payment-first',
    features: {
      monthly: [
        { name: 'Search Produk Tidak Terbatas', included: true },
        { name: 'Scrape Detail Produk 2.000 /Hari', included: true },
        { name: 'Upload Produk Tidak Terbatas', included: true },
        { name: 'AI Optimasi Deskripsi Produk', included: true },
        { name: 'Frame Gambar Produk', included: true },
        { name: 'Data Backup', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Atur Keuntungan', included: true },
        { name: 'AI Optimasi Judul Produk', included: true },
        { name: 'Filter Kata/Kalimat', included: true },
      ],
      annual: [
        { name: 'Search Produk Tidak Terbatas', included: true },
        { name: 'Upload Produk Tidak Terbatas', included: true },
        { name: 'Scrape Detail Produk Tak Terbatas', included: true },
        { name: 'AI Optimasi Judul Produk', included: true },
        { name: 'AI Optimasi Deskripsi Produk', included: true },
        { name: 'Data Backup', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Frame Gambar Produk', included: true },
        { name: 'Filter Kata/Kalimat', included: true },
        { name: 'Atur Keuntungan', included: true },
      ],
    },
  },
};

const SATUAN_FEATURE_CATALOG: Array<{
  id: string;
  label: string;
  base: 'starter' | 'basic' | 'pro';
  factor: number; // multiplier of base per-seat monthly
}> = [
  { id: 'ai', label: 'AI Optimasi Deskripsi', base: 'basic', factor: 0.5 },
  { id: 'frame', label: 'Frame Gambar Produk', base: 'pro', factor: 0.4 },
  { id: 'backup', label: 'Data Backup', base: 'pro', factor: 0.5 },
  { id: 'priority', label: 'Priority Support', base: 'pro', factor: 0.6 },
];

const PlanSelector: React.FC<PlanSelectorProps> = ({
  selectedPlan,
  onSelectPlan,
  billingCycle: controlledCycle,
  paymentFirst = false,
  ignoreQueryFlow = false,
  ctaMode = 'link',
  onPurchaseSatuan,
  onCycleChange,
}) => {
  const searchParams = useSearchParams();
  const [billingCycleState, setBillingCycleState] = useState<BillingCycle>(
    controlledCycle ?? 'monthly'
  );
  const billingCycle = controlledCycle ?? billingCycleState;
  useEffect(() => {
    if (controlledCycle) {
      setBillingCycleState(controlledCycle);
    }
  }, [controlledCycle]);
  // Satuan configurator state
  const [satuanMonths, setSatuanMonths] = useState<number>(1); // 1,2,3,6
  const [seatCount, setSeatCount] = useState<number>(1); // 1..4
  const [scrapeTier, setScrapeTier] = useState<'500' | '1000' | '2000' | 'unlimited'>('500');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [satuanOpen, setSatuanOpen] = useState<boolean>(false);

  // Payment-first minimal form state
  const [pfName, setPfName] = useState('');
  const [pfEmail, setPfEmail] = useState('');
  const [pfError, setPfError] = useState<string | null>(null);
  const [pfLoading, setPfLoading] = useState(false);
  const [inlinePending, setInlinePending] = useState<{ txId: string; url?: string } | null>(null);

  const plans = useMemo(
    () =>
      Object.entries(pricingCatalog).map(([planId, plan]) => {
        const monthlySpend = plan.monthlyPrice;
        const annualSpend = plan.annualPrice;
        const monthlyTotal = monthlySpend * 12;
        const annualSavings = monthlyTotal - annualSpend;
        const savingsPercent = Math.round((annualSavings / monthlyTotal) * 100);
        const perKeyMonthly = Math.round(monthlySpend / plan.devices);
        const perKeyAnnual = Math.round(annualSpend / (plan.devices * 12));

        const baseFeatures = plan.features[billingCycle] ?? [];
        const enrichedFeatures: PlanFeature[] = [
          { name: `${plan.devices} Perangkat`, included: true },
          ...baseFeatures,
        ];

        return {
          id: planId as PlanId,
          data: plan,
          features: enrichedFeatures,
          description: plan.description[billingCycle],
          displayPrice: billingCycle === 'monthly' ? monthlySpend : annualSpend,
          annualSavings,
          savingsPercent,
          monthlyTotal,
          annualTotal: annualSpend,
          perKeyMonthly,
          perKeyAnnual,
        };
      }),
    [billingCycle]
  );

  // Derive actual mode: if no explicit prop, detect from query
  const isPaymentFirst = useMemo(() => {
    const flow = searchParams?.get('flow');
    return paymentFirst || (!ignoreQueryFlow && flow === 'payment-first');
  }, [paymentFirst, ignoreQueryFlow, searchParams]);

  // Preselect plan from query if not set
  useEffect(() => {
    if (!isPaymentFirst) return;
    if (selectedPlan) return;
    const qPlan = searchParams?.get('plan');
    if (qPlan && ['starter', 'basic', 'pro'].includes(qPlan)) {
      onSelectPlan(qPlan as SubscriptionPlan);
    }
  }, [isPaymentFirst, selectedPlan, searchParams, onSelectPlan]);

  const selectedPlanMeta = useMemo(() => {
    if (!selectedPlan) return null;
    const found = plans.find((p) => p.id === selectedPlan);
    return found || null;
  }, [selectedPlan, plans]);

  const handleStartPayment = async () => {
    try {
      setPfError(null);
      if (!selectedPlan) {
        setPfError('Silakan pilih paket.');
        return;
      }
      if (!pfName || !pfEmail) {
        setPfError('Nama dan email wajib diisi.');
        return;
      }
      setPfLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pfName,
          email: pfEmail,
          plan: selectedPlan,
          paymentMethod: 'shopeepay_qris',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success || !data?.payment?.paymentUrl) {
        throw new Error(data?.error || 'Gagal memulai pembayaran');
      }
      // Persist pending registration context
      try {
        const pending = {
          userId: data.user?.id,
          transactionId: data.payment?.transactionId,
          email: data.user?.email,
          plan: selectedPlan,
          name: data.user?.name,
        };
        window.localStorage.setItem('autolaku_pending_registration', JSON.stringify(pending));
      } catch {}
      setInlinePending({ txId: data.payment.transactionId, url: data.payment.paymentUrl });
      // Open payment tab
      window.open(data.payment.paymentUrl, '_blank');
    } catch (e: any) {
      setPfError(e?.message || 'Terjadi kesalahan saat memulai pembayaran');
    } finally {
      setPfLoading(false);
    }
  };

  // Derive per-seat monthly rates from catalog
  const derivedRates = useMemo(() => {
    const starter = pricingCatalog.starter.monthlyPrice / pricingCatalog.starter.devices;
    const basic = pricingCatalog.basic.monthlyPrice / pricingCatalog.basic.devices;
    const pro = pricingCatalog.pro.monthlyPrice / pricingCatalog.pro.devices;
    return {
      starterPerSeatMonthly: Math.round(starter),
      basicPerSeatMonthly: Math.round(basic),
      proPerSeatMonthly: Math.round(pro),
    };
  }, []);

  // Compute Satuan (one-time) pricing
  const satuanPricing = useMemo(() => {
    const months = Math.max(1, Math.min(6, satuanMonths));
    const slightMarkup = 1.045; // ~5% lower than previous 1.1 markup

    // Base per-seat (monthly)
    const seatBaseMonthly = Math.round(derivedRates.starterPerSeatMonthly * slightMarkup);

    // Scrape add-on (monthly)
    const scrapeAddOnMonthly = (() => {
      switch (scrapeTier) {
        case '1000': {
          // half of pro per-seat monthly, with small markup
          return Math.round(derivedRates.proPerSeatMonthly * 0.5 * slightMarkup);
        }
        case '2000': {
          // 0.8x pro per-seat monthly, with small markup
          return Math.round(derivedRates.proPerSeatMonthly * 0.8 * slightMarkup);
        }
        case 'unlimited': {
          // equal to pro per-seat monthly, with small markup
          return Math.round(derivedRates.proPerSeatMonthly * 1.0 * slightMarkup);
        }
        default:
          return 0; // 500/day included in base
      }
    })();

    // Premium features (monthly)
    const featureAddOnMonthly = selectedFeatures.reduce((sum, featureId) => {
      const feature = SATUAN_FEATURE_CATALOG.find((f) => f.id === featureId);
      if (!feature) {
        return sum;
      }
      const baseRate =
        feature.base === 'starter'
          ? derivedRates.starterPerSeatMonthly
          : feature.base === 'basic'
          ? derivedRates.basicPerSeatMonthly
          : derivedRates.proPerSeatMonthly;
      return sum + Math.round(baseRate * feature.factor * slightMarkup);
    }, 0);

    const perSeatMonthlyTotal = seatBaseMonthly + scrapeAddOnMonthly + featureAddOnMonthly;
    const perSeatTotal = perSeatMonthlyTotal * months;
    const total = perSeatTotal * seatCount;
    return {
      months,
      seatBaseMonthly,
      scrapeAddOnMonthly,
      featureAddOnMonthly,
      perSeatMonthlyTotal,
      perSeatTotal,
      total,
    };
  }, [derivedRates, seatCount, scrapeTier, selectedFeatures, satuanMonths]);

  const toggleFeature = (key: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="w-full space-y-5">
      <div className="text-xs text-white/50 space-y-2">
        {isPaymentFirst && (
          <div className="bg-dark-900 border border-white/10 p-3 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-white/70 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={pfName}
                  onChange={(e) => setPfName(e.target.value)}
                  className="__input"
                  placeholder="Nama Anda"
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/70 mb-1">Email</label>
                <input
                  type="email"
                  value={pfEmail}
                  onChange={(e) => setPfEmail(e.target.value)}
                  className="__input"
                  placeholder="email@domain.com"
                />
              </div>
            </div>
            {pfError && <div className="text-xs text-red-400">{pfError}</div>}
          </div>
        )}
        <div className="inline-flex border border-white/10 bg-dark-900 p-1 w-fit">
          {(['monthly', 'annual'] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              onClick={() => {
                if (!controlledCycle) {
                  setBillingCycleState(cycle);
                }
                onCycleChange?.(cycle);
              }}
              className={`min-w-[120px] px-3 py-1 text-sm font-medium transition relative ${
                billingCycle === cycle
                  ? 'bg-white text-black shadow'
                  : 'text-white/70 hover:text-white'
              }`}>
              {cycle === 'monthly' ? 'Bulanan' : 'Tahunan'}
              {cycle === 'annual' && (
                <span className="tracking-normal bg-red-600 absolute -top-2 -right-3 px-1 py-0.5 text-white text-[9px] flex w-fit">
                  -20%
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="w-full flex items-center justify-center p-1">
          <button className="relative inline-flex overflow-hidden rounded-lg p-[1.5px] focus:outline-none focus:ring-0">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFF333_0%,#000_50%,#FFF333_100%)]" />
            <span className=" h-full w-full pointer-events-none text-xs items-center justify-center rounded-lg bg-dark-650 py-0.5 px-2 flex gap-2 font-medium text-white backdrop-blur-3xl">
              <FaRegLightbulb /> Semua Paket Bisa Menambahkan Add-On Fitur Premium yang belum
              termasuk
            </span>
          </button>
        </div>
      </div>
      <div className="grid w-full gap-5 md:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className={`group space-y-3 relative flex h-full flex-col border bg-dark-900 p-3 border-t-4 hover:border-t-white text-left transition-all duration-300 ${
              selectedPlan === plan.id
                ? 'border-white text-white border-t-white shadow-[0_0_25px_rgba(255,255,255,0.15)] border-t-4'
                : 'border-white/10 text-white/80 border-t-4 hover:border-x-white/20 border-t-white hover:border-b-white/20 hover:text-white'
            } cursor-pointer`}
            onClick={() => onSelectPlan(plan.id as SubscriptionPlan)}>
            <header className="space-y-3 text-center">
              <h3
                className={cn(
                  'text-2xl font-semibold tracking-widest text-white p-1 border ',
                  index === 1
                    ? 'border-white/30 text-white bg-gradient-to-tr from-white/5 via-white/20 to-white/5 from-0% via-10% to-100%'
                    : 'bg-black border-white/10'
                )}>
                {plan.data.title}
              </h3>
              <div className="flex flex-row items-center justify-between px-3 py-1 bg-dark-750">
                <h3 className="text-3xl font-bold text-white flex items-start justify-start gap-1 relative">
                  <span className="text-sm text-white/50">Rp</span>
                  {Math.round(plan.displayPrice / 1000)}K
                  {billingCycle === 'annual' ? (
                    <span className="line-through tracking-normal absolute bottom-0 -right-2/5 px-1 py-0.5 text-red-500 text-xs flex w-fit">
                      {Math.round(plan.monthlyTotal / 1000)}K
                    </span>
                  ) : (
                    plan.id === 'pro' && (
                      <span className="line-through tracking-normal absolute bottom-0 -right-1/2 px-1 py-0.5 text-red-500 text-xs flex w-fit">
                        {Math.round(plan.monthlyTotal / 1000)}K
                      </span>
                    )
                  )}
                </h3>
                <div className="text-xs uppercase text-white/80 font-semibold">
                  / {billingCycle === 'monthly' ? 'bulan' : 'tahun'}
                </div>
              </div>
            </header>
            <div className="flex justify-center">
              <Button
                onClick={(event) => {
                  if (isPaymentFirst || ctaMode === 'select') {
                    event.preventDefault();
                    onSelectPlan(plan.id as SubscriptionPlan);
                  }
                }}
                asChild={!(isPaymentFirst || ctaMode === 'select')}
                className={cn(
                  'w-full justify-center text-sm font-semibold transition-all duration-500 border',
                  index === 1
                    ? 'bg-white text-black hover:bg-light-300'
                    : 'bg-white/20 text-white hover:bg-white/30 hover:border-white/10 border-transparent'
                )}>
                {!(isPaymentFirst || ctaMode === 'select') ? (
                  <Link href={plan.data.cta} className="flex items-center justify-center gap-2">
                    <span>Daftar Sekarang</span>
                    <ArrowRight size={32} />
                  </Link>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Pilih Paket
                    <ArrowRight size={32} />
                  </span>
                )}
              </Button>
            </div>
            <div className="border border-dark-750 bg-gradient-to-bl from-dark-800 from-10% via-dark-900 via-50% to-black to-100% p-3 space-y-3">
              <ul className="space-y-2 text-sm">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className={cn(
                      'flex items-center gap-3',
                      feature.included ? 'text-white/85' : 'text-white/30 line-through'
                    )}>
                    {feature.included ? (
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    ) : (
                      <X className="h-4 w-4 text-white/30" />
                    )}
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
                {billingCycle === 'annual' ? (
                  <>
                    <span className="border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-semibold text-sky-500">
                      2 bulan gratis
                    </span>
                    <span className="border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-sky-500">
                      Hemat {plan.savingsPercent}%
                    </span>
                    <span className="border border-white/20 bg-white/10 px-3 py-1 text-white/70">
                      Terhitung Rp {Math.round(plan.perKeyAnnual / 1000)}K /Key
                    </span>
                  </>
                ) : (
                  <>
                    <span className="border border-white/20 bg-white/10 px-3 py-1 text-white/70">
                      Terhitung Rp {Math.round(plan.perKeyMonthly / 1000)}K /Key
                    </span>
                  </>
                )}
              </div>
            </div>
            <p className="px-2 text-xs text-white/50">{plan.description}</p>
          </div>
        ))}
      </div>
      {isPaymentFirst && (
        <div className="w-full mt-4 border border-white/10 bg-dark-900 p-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-white/70">
              {selectedPlanMeta ? (
                <>
                  <div>
                    Paket dipilih:{' '}
                    <span className="font-semibold text-white uppercase">
                      {selectedPlanMeta.data.title}
                    </span>
                  </div>
                  <div>
                    Total: Rp{' '}
                    <span className="font-semibold text-white">
                      {Math.round(selectedPlanMeta.displayPrice / 1000)}K /{' '}
                      {billingCycle === 'monthly' ? 'bulan' : 'tahun'}
                    </span>
                  </div>
                </>
              ) : (
                <div>Pilih paket terlebih dahulu.</div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                disabled={pfLoading}
                onClick={handleStartPayment}
                className="bg-white text-black hover:bg-light-300">
                {pfLoading ? 'Memproses…' : 'Bayar dengan QRIS'}
              </Button>
            </div>
          </div>
          {inlinePending && (
            <div className="mt-3">
              <PaymentStatus
                status="pending"
                transactionId={inlinePending.txId}
                paymentUrl={inlinePending.url}
              />
            </div>
          )}
        </div>
      )}

      <div className="w-full relative flex flex-col lg:flex-row items-end justify-between overflow-hidden z-20 bg-white text-black p-3 md:p-5">
        <div className="space-y-3 text-start ">
          <h3 className="text-xl flex items-center gap-2 shadow-md text-white shadow-white/20 w-fit font-semibold tracking-widest  py-1 px-2 border border-white/30 bg-gradient-to-bl from-black/70 via-black/90 to-black/70 from-0% via-10% to-100%">
            <BsBuildings /> Enterprise
          </h3>
          <h2 className="text-2xl font-semibold md:text-3xl">
            Langganan Khusus untuk Dropshipper Skala Besar
          </h2>
          <p className="text-sm text-black/70 md:text-base max-w-2xl">
            Paket enterprise diperuntukkan bagi dropshipper yang memerlukan kapasitas lebih besar
            dari paket Pro dan membutuhkan penyesuaian paket harga, dan dukungan prioritas.
          </p>
        </div>
        <div className="relative">
          <span className="tracking-normal bg-sky-500 absolute -top-2 -left-3 px-1 py-0.5 text-white text-[9px] flex w-fit">
            Biaya Konsultasi Gratis
          </span>
          <Button
            asChild
            size="lg"
            className="flex-1 border border-transparent bg-black text-white transition-all duration-300 hover:bg-black/80">
            <Link
              href="https://wa.me/62885133319998"
              target="blank"
              className="flex items-center justify-center gap-2">
              Hubungi Tim Penjualan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="absolute -right-8 -bottom-28 opacity-10 h-[500px]">
          <ADotted color="#000000" />
        </div>
      </div>
      {/* Satuan trigger link */}
      <div className="w-full text-center text-xs text-white/70 mt-4">
        <button
          type="button"
          className="underline underline-offset-4 hover:text-white"
          onClick={() => setSatuanOpen(true)}>
          Beli Lisensi Satuan (license key)
        </button>
      </div>

      {/* Satuan Modal */}
      {satuanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 liquid-glass-enhanced liquid-glass glass-border-enhanced"
            onClick={() => setSatuanOpen(false)}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-2xl group space-y-3 flex flex-col border bg-dark-900 p-3 border-t-white text-left transition-all duration-300 border-white/10 text-white/80 border-t-4 hover:border-x-white/20 hover:border-b-white/20 hover:text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-xl flex items-center gap-2 font-semibold tracking-widest text-white py-1 px-2 border w-fit border-white/30 text-white bg-gradient-to-tr from-white/5 via-white/20 to-white/5 from-0% via-10% to-100%">
                  <GrLicense /> Paket Satuan (license key)
                </h3>
                <p className="text-xs text-white/60">
                  Upload selalu tak terbatas. Atur kuota
                  <span className="font-semibold text-white"> Scrape Detail Produk </span>
                  dan pilih fitur premium sesuai kebutuhan.
                </p>
              </div>
              <button
                type="button"
                className="text-white/60 hover:text-white"
                onClick={() => setSatuanOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-2 space-y-4">
              {/* Duration */}
              <div className="space-y-2 text-left">
                <div className="text-xs uppercase text-white/80 font-semibold">Durasi</div>
                <div className="inline-flex border border-white/10 bg-dark-800 p-1">
                  {[1, 2, 3, 6].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSatuanMonths(m)}
                      className={`min-w-[60px] px-3 py-1 text-sm font-medium transition ${
                        satuanMonths === m
                          ? 'bg-white text-black shadow'
                          : 'text-white/70 hover:text-white'
                      }`}>
                      {m} bln
                    </button>
                  ))}
                </div>
              </div>

              {/* Seat count */}
              <div className="space-y-2 text-left">
                <div className="text-xs uppercase text-white/80 font-semibold">Jumlah Lisensi</div>
                <div className="inline-flex border border-white/10 bg-dark-800 p-1">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSeatCount(n)}
                      className={`min-w-[48px] px-3 py-1 text-sm font-medium transition ${
                        seatCount === n
                          ? 'bg-white text-black shadow'
                          : 'text-white/70 hover:text-white'
                      }`}>
                      {n}x
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-white/50">
                  Butuh 5+ lisensi? Pertimbangkan paket Starter untuk nilai terbaik.
                </div>
              </div>

              {/* Scrape tier */}
              <div className="space-y-2 text-left">
                <div className="text-xs uppercase text-white/80 font-semibold">
                  Kuota Scrape Detail Produk per Hari
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: '500' as const, label: '500/hari', note: 'Termasuk' },
                    { id: '1000' as const, label: '1.000/hari' },
                    { id: '2000' as const, label: '2.000/hari' },
                    { id: 'unlimited' as const, label: 'Tak Terbatas' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setScrapeTier(opt.id)}
                      className={`px-3 py-1 text-sm border ${
                        scrapeTier === opt.id
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-white/80 border-white/20 hover:border-white/40'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-white/50">
                  Upload produk selalu <span className="font-semibold">tak terbatas</span>.
                </div>
              </div>

              {/* Premium features */}
              <div className="space-y-2 text-left">
                <div className="text-xs uppercase text-white/80 font-semibold">Fitur Premium</div>
                <div className="grid grid-cols-2 gap-2">
                  {SATUAN_FEATURE_CATALOG.map((f) => {
                    const isSelected = selectedFeatures.includes(f.id);
                    return (
                      <label
                        key={f.id}
                        className={`flex items-center gap-2 border px-3 py-2 cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-white/80 border-white/20 hover:border-white/40'
                        }`}
                        onClick={() => toggleFeature(f.id)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFeature(f.id)}
                          className="hidden"
                        />
                        <span
                          className={`h-4 w-4 grid place-items-center border ${
                            isSelected ? 'bg-white text-black border-black' : 'border-white/40'
                          }`}
                          aria-hidden>
                          {isSelected ? <Check className="h-3 w-3" /> : null}
                        </span>
                        <span className="text-sm">{f.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Total + CTA */}
              <div className="mt-3 flex items-center justify-between border border-dark-750 bg-gradient-to-bl from-dark-800 from-10% via-dark-900 via-50% to-black to-100% p-3">
                <div className="text-sm">
                  <div className="text-white/70">Total Sekali Beli</div>
                  <div className="text-2xl font-bold text-white">
                    Rp {Math.round(satuanPricing.total / 1000)}K
                  </div>
                </div>
                <Button
                  className="bg-white text-black hover:bg-light-300"
                  onClick={() =>
                    onPurchaseSatuan?.({
                      seatCount,
                      months: satuanPricing.months,
                      scrapeTier,
                      features: selectedFeatures,
                      totalPrice: satuanPricing.total,
                    })
                  }>
                  Beli Sekarang
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanSelector;
