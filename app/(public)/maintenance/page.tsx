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
import Link from 'next/link';

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
    <div className="flex h-screen w-screen z-50 absolute bg-dark-800 top-0 left-0 flex-col items-center justify-center overflow-hidden border-y-[1px] border-white/10">
      <div className="flex relative z-[99999999999999] flex-col items-center justify-center gap-5 backdrop-blur !bg-black/5 border-[1px] border-white/10 py-5 px-10 rounded">
        <p className="tracking-widest text-gray-200 font-thin ">Maintenance</p>
        <Link className="rounded-button" href="/">
          Back Home
        </Link>
      </div>

      <div className="absolute inset-0 z-10 h-full w-full bg-black/70" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full "
        images={images}
      />
    </div>
  );
};

export default page;
