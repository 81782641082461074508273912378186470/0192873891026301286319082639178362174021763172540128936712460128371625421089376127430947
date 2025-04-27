import Feature from '@/components/Feature';
import { GlowingGrid } from '@/components/GlowingGrid';
import { HomeWrapper } from '@/components/HomeWrapper';
import Integrated from '@/components/Integrated';
import HeroSection from '@/components/sections/HeroSection';
import { generateMetadata } from '@/lib/utils';
import { Metadata } from 'next';
export const metadata: Metadata = generateMetadata({
  title: 'Dropship Cepat & Efisien',
  description:
    'Platform dropshipping otomatis memberikan efisiensi maksimal dan kompatibel dengan MacOS & Windows sekaligus mudah digunakan.',
  url: 'https://autolaku.com',
  image: 'https://autolaku.com/images/og-autolaku.webp',
  keywords:
    'Beranda Autolaku, Dropshipping Indonesia, Otomasi dropshipping, Dropshipping modern, Teknologi canggih dropshipping, Tips dropshipping, Alat dropshipping pintar',
});

const HomePage = () => {
  return (
    <main className="flex flex-col justify-start items-center w-full h-full">
      <HomeWrapper>
        <HeroSection />
        <Feature />
        <Integrated />
        <GlowingGrid />
      </HomeWrapper>
    </main>
  );
};

export default HomePage;
