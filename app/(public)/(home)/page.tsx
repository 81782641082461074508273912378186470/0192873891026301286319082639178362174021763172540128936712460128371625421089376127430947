import { GlowingGridSection } from '@/components/sections/GlowingGridSection';
import { HomeWrapper } from '@/components/HomeWrapper';
import FeatureSection from '@/components/sections/FeatureSection';
import HeroSection from '@/components/sections/HeroSection';
import IntegratedSection from '@/components/sections/IntegratedSection';
import { generateMetadata } from '@/lib/utils';
import { Metadata } from 'next';
import InfiniteLogoSection from '@/components/sections/InfiniteLogoSection';
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
        <FeatureSection />
        <IntegratedSection />
        <InfiniteLogoSection />
        <GlowingGridSection />
      </HomeWrapper>
    </main>
  );
};

export default HomePage;
