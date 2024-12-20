import HeroSection from '@/components/sections/HeroSection';
import { generateMetadata } from '@/lib/utils';
import { Metadata } from 'next';
export const metadata: Metadata = generateMetadata({
  title: 'Beranda', // Specific title for the homepage
  description:
    'Selamat datang di Autolaku! Platform dropshipping modern untuk mengelola bisnis Anda dengan efisiensi dan teknologi canggih.',
  url: 'https://autolaku.com',
  image: 'https://autolaku.com/images/homepage-banner.webp',
  keywords:
    'Beranda Autolaku, Dropshipping Indonesia, Otomasi dropshipping, Dropshipping modern, Teknologi canggih dropshipping, Tips dropshipping, Alat dropshipping pintar',
});

const HomePage = () => {
  return (
    <div className="w-screen h-screen bg-black">
      <HeroSection />
    </div>
  );
};

export default HomePage;
