import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Metadata } from 'next';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateMetadata = ({
  title,
  description,
  url,
  image,
  keywords,
}: {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  keywords?: string;
}): Metadata => {
  const defaultKeywords =
    'Dropshipping di Era Digital, Otomatisasi Proses Dropshipping, Dropshipping dengan Efisiensi Tinggi, Teknologi Dropshipping Cerdas, Platform Dropshipping Terkini, Dropshipping untuk Pengusaha Baru, Dropshipping untuk Ahli, E-commerce Automation, Fitur Canggih Dropshipping, Bot Pintar untuk Dropshipping, Tools E-commerce Modern, Tutorial Dropshipping Indonesia, Rahasia Sukses dalam Dropshipping, Sistem Otomatis E-commerce, Panduan Awal Dropshipping, Strategi Dropshipping Sukses, Tools Dropshipping Inovatif, E-commerce yang Diolah Otomatis, Langkah Awal dalam Dropshipping, Solusi Dropshipping Terintegrasi, Teknik Dropshipping untuk Profesional, Sistem Dropshipping Berteknologi, Dropshipping dengan AI, Pengoptimalan Proses Dropshipping, Alat Dropshipping yang Efektif, Metode Dropshipping Terbaru, Solusi Otomatisasi Dropshipping, Pemula dalam Dunia Dropshipping, E-commerce dengan Otomatisasi Lengkap, Trik Sukses Dropshipping, Solusi Teknologi untuk Dropshipping, Tools Pintar untuk Bisnis Online, Panduan Lengkap Dropshipping, Kiat Sukses Dropshipping, Otomatisasi E-commerce Berbasis AI, Tips dan Trik Dropshipping, Platform Dropshipping dengan Fitur Lengkap, Teknologi Canggih untuk Dropshipping, Solusi Dropshipping untuk Semua Level, Bot Otomatis untuk E-commerce, Alat E-commerce yang Cerdas, Panduan Sukses Dropshipping, Cara Efisien dalam Dropshipping, Teknologi Dropshipping Mutakhir, Solusi Bisnis E-commerce yang Pintar, Dropshipping dengan Alat Canggih, Awal Mula dalam Dropshipping, E-commerce yang Diotomatisasi, Trik dan Tips Dropshipping, Tools E-commerce yang Inovatif, Panduan Praktis Dropshipping, Strategi Sukses Dropshipping, Solusi Teknologi Dropshipping, Tools Online untuk Dropshipping, Panduan Utama Dropshipping, Kiat Sukses dalam Dropshipping, Otomatisasi E-commerce Cerdas, Tips untuk Dropshipper Pemula, Platform Dropshipping dengan Teknologi, Solusi Dropshipping untuk Profesional, Bot Cerdas untuk Proses Dropshipping, Alat E-commerce yang Efisien, Panduan Dropshipping yang Komprehensif, Cara Sukses dalam Dunia Dropshipping, Teknologi Dropshipping yang Inovatif, Solusi Otomatisasi untuk E-commerce, Tools Dropshipping yang Modern, Panduan Awal Dropshipping yang Efektif, Strategi Sukses dalam Dropshipping, Solusi Teknologi untuk Bisnis Dropshipping, Tools Online untuk E-commerce, Panduan Utama dalam Dropshipping, Kiat dan Strategi Dropshipping, Otomatisasi E-commerce yang Canggih, Tips untuk Memulai Dropshipping, Platform Dropshipping dengan Fitur Canggih.';
  const defaultTitle = 'Autolaku | Automation Modern untuk Dropshipping yang Cepat dan Efisien';
  const defaultDescription =
    'Platform dropshipping otomatis memberikan efisiensi maksimal dan kompatibel dengan MacOS & Windows sekaligus mudah digunakan.';
  const defaultImage = 'https://autolaku.com/images/og-autolaku.webp';
  const defaultUrl = 'https://autolaku.com';
  return {
    title: title ? `${title} | Autolaku` : defaultTitle,
    description: description || defaultDescription,
    icons: {
      icon: [
        {
          url: '/icons/android-chrome-192x192.png',
          sizes: '192x192',
        },
        {
          url: '/icons/android-chrome-512x512.png',
          sizes: '512x512',
        },
        {
          url: '/icons/favicon-16x16.png',
          sizes: '16x16',
        },
        {
          url: '/icons/favicon-32x32.png',
          sizes: '32x32',
        },
      ],
      apple: [
        {
          url: '/icons/apple-touch-icon.png',
          sizes: '180x180',
        },
      ],
      shortcut: [
        {
          url: '/icons/favicon-32x32.png',
          sizes: '32x32',
        },
      ],
    },

    manifest: '/manifest.json',
    keywords: `${keywords} ${defaultKeywords}`,
    openGraph: {
      type: 'website',
      url: url || defaultUrl,
      title: title ? `${title} | Autolaku` : defaultTitle,
      description: description || defaultDescription,
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: '',
        },
      ],
      siteName: 'Auto',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Autolaku',
      title: title ? `${title} | Autolaku` : defaultTitle,
      description: description || defaultDescription,
      images: [
        {
          url: image || defaultImage,
          alt: 'Platform dropshipping otomatis memberikan efisiensi maksimal dan kompatibel dengan MacOS & Windows sekaligus mudah digunakan.',
        },
      ],
    },
    alternates: {
      canonical: url || defaultUrl,
    },
  };
};
