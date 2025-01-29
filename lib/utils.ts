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
    'Dropshipping Indonesia, Otomasi dropshipping, Dropshipping yang efisien, Alat dropshipping pintar, Solusi dropshipping modern,Dropshipping untuk pemula, Dropshipping profesional, Otomasi bisnis e-commerce, Fitur dropshipping Indonesia, Bot dropshipping pintar, Alat bisnis e-commerce, Panduan dropshipping Indonesia, Cara sukses dropshipping, Otomasi bisnis e-commerce, Tips dropshipping pemula';
  const defaultTitle = 'Autolaku | Automation Modern untuk Dropshipping yang Cepat dan Efisien';
  const defaultDescription =
    'Autolaku adalah platform dropshipping modern yang dirancang untuk membantu dropshipper Indonesia mengelola produk, pesanan, dan pengiriman secara efisien. Dengan teknologi otomatisasi canggih, Anda dapat menjalankan bisnis lebih cepat, mudah, dan bebas repot.';
  const defaultImage = 'https://autolaku.com/images/og-images.webp';
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
          alt: 'Autolaku | Otomasi Modern untuk Dropshipping yang Cepat dan Efisien',
        },
      ],
    },
    alternates: {
      canonical: url || defaultUrl,
    },
  };
};
