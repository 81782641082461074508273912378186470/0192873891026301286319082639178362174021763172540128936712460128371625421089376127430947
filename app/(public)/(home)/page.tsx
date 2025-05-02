import Feature from '@/components/Feature';
import { GlowingGrid } from '@/components/GlowingGrid';
import { HomeWrapper } from '@/components/HomeWrapper';
import Integrated from '@/components/Integrated';
import MagicBean from '@/components/MagicBean';
import HeroSection from '@/components/sections/HeroSection';
import { generateMetadata } from '@/lib/utils';
import { Metadata } from 'next';
import { GrConnect } from 'react-icons/gr';
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
        <div className="w-full flex flex-col justify-center items-center">
          <h3 className="text-lg items-center font-light tracking-widest select-none flex gap-2 text-white">
            <GrConnect className="text-xl" /> Terintegrasi dengan
          </h3>
          <p className="text-light-500 font-light tracking-widest select-none flex gap-2">
            Ecommerce dan Teknologi Terkini
          </p>
          <MagicBean />
        </div>
        <Integrated />
        <GlowingGrid />
      </HomeWrapper>
    </main>
  );
};

export default HomePage;
