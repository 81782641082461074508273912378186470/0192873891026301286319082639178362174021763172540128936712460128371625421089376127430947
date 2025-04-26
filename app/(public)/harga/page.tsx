/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import React from 'react';
import AIConfig from '@/assets/images/AIKonfigurasi.webp';
import AIOptimalisasi from '@/assets/images/AIOptimalisasi.webp';
import AntrianScrape from '@/assets/images/AntrianScrape.webp';
import AturKeuntungan from '@/assets/images/AturKeuntungan.webp';
import HapusKataTerlarang from '@/assets/images/HapusKataTerlarang.webp';
import KelolaProduk from '@/assets/images/KelolaProduk.webp';
import Login from '@/assets/images/Login.webp';
import PencarianProduk from '@/assets/images/CariProduk.webp';
import PersiapkanProduk from '@/assets/images/PersiapkanProduk.webp';

const page = () => {
  function getImageUrl(imageModule: any) {
    if (typeof imageModule === 'string') {
      return imageModule;
    } else if (imageModule && typeof imageModule === 'object') {
      if (imageModule.src) {
        return imageModule.src;
      } else if (imageModule.default) {
        return imageModule.default;
      }
    }
    throw new Error('Unable to determine image URL');
  }

  const images = [
    getImageUrl(PencarianProduk),
    getImageUrl(AIOptimalisasi),
    getImageUrl(AntrianScrape),
    getImageUrl(Login),
    getImageUrl(PersiapkanProduk),
    getImageUrl(PencarianProduk),
    getImageUrl(AturKeuntungan),
    getImageUrl(AIConfig),
    getImageUrl(PencarianProduk),
    getImageUrl(HapusKataTerlarang),
    getImageUrl(KelolaProduk),
    getImageUrl(PersiapkanProduk),
    getImageUrl(HapusKataTerlarang),
    getImageUrl(AturKeuntungan),
    getImageUrl(AIOptimalisasi),
    getImageUrl(AIConfig),
    getImageUrl(PersiapkanProduk),
    getImageUrl(AturKeuntungan),
    getImageUrl(KelolaProduk),
    getImageUrl(PencarianProduk),
    getImageUrl(KelolaProduk),
    getImageUrl(AIConfig),
    getImageUrl(AntrianScrape),
    getImageUrl(AntrianScrape),
    getImageUrl(KelolaProduk),
    getImageUrl(AIConfig),
    getImageUrl(AntrianScrape),
    getImageUrl(AIOptimalisasi),
    getImageUrl(PersiapkanProduk),
    getImageUrl(AIOptimalisasi),
    getImageUrl(HapusKataTerlarang),
    getImageUrl(AturKeuntungan),
    getImageUrl(HapusKataTerlarang),
    getImageUrl(Login),
  ];
  return (
    <div className="flex h-screen w-full flex-col max-w-screen-xl items-center justify-center overflow-hidden border-y-[1px] border-white/10">
      {/* <h2 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
        This is your life and it&apos;s ending one{' '}
        <span className="relative z-20 inline-block rounded-xl bg-blue-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
          moment
        </span>{' '}
        at a time.
      </h2>
      <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
        You are not your job, you&apos;re not how much money you have in the bank. You are not the
        car you drive. You&apos;re not the contents of your wallet.
      </p> */}
      <p className="relative tracking-widest text-gray-200 font-thin z-20 flex flex-wrap items-center justify-center gap-5">
        Coming Soon
      </p>
      {/* <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
        <button className="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Join the club
        </button>
        <button className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Read more
        </button>
      </div> */}

      <div className="absolute inset-0 z-10 h-full w-full bg-black/70 " />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full "
        images={images}
      />
    </div>
  );
};

export default page;
