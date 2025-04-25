'use client';

import { RiTimerFlashLine } from 'react-icons/ri';
import { BsStars } from 'react-icons/bs';
import { SiCloudinary } from 'react-icons/si';
import { AiOutlineLike } from 'react-icons/ai';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { PiChartLineUp } from 'react-icons/pi';

export function GlowingGrid() {
  return (
    <div className="max-w-screen-xl w-full px-5 2xl:px-0  bg-black bg-dot-white/[0.3] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <ul className="grid grid-cols-1 grid-rows-none gap-5 md:grid-cols-12 md:grid-rows-3 xl:max-h-[34rem] xl:grid-rows-2 px-5 lg:px-0 ">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<BsStars className="h-5 w-5 text-white" />}
          title="Integrasi AI Canggih dari xAI dan OpenAI"
          description="Menggunakan teknologi AI untuk otomatisasi cerdas, termasuk deskripsi produk optimal."
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<SiCloudinary className="h-5 w-5 text-white" />}
          title="Pengolahan Gambar Efisien dengan Cloudinary."
          description="Didukung Cloudinary untuk memastikan gambar produk diolah dengan cepat, aman, dan profesional."
        />

        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<AiOutlineLike className="h-5 w-5 text-white" />}
          title="Pengembangan Bisnis Tanpa Kompleksitas"
          description="Membantu dropshipper mengembangkan bisnis secara profesional tanpa kebutuhan akan alat terpisah."
        />

        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<RiTimerFlashLine className="h-5 w-5 text-white" />}
          title="Optimalkan Waktu Anda dengan Otomatisasi Berbasis AI"
          description="Manfaatkan kecerdasan buatan untuk mengotomatiskan tugas rutin, menghemat waktu secara signifikan."
        />

        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<PiChartLineUp className="h-5 w-5 text-white" />}
          title="Peningkatan Produktivitas dan Keuntungan Maksimal"
          description="Tingkatkan efisiensi kerja dan hasilkan keuntungan lebih besar melalui alat terpadu yang dirancang untuk produktivitas unggul."
        />
      </ul>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-white/50 p-5 md:rounded-3xl ">
        <GlowingEffect
          blur={1}
          borderWidth={4}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden bg-dark-800/30 rounded-xl border-0.75 p-6 shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded border-[1px] border-white/30 bg-dark-700 p-2 ">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-white">
                {title}
              </h3>
              <h2
                className="md:[&_b]:font-semibold md:[&_strong]:font-semibold font-sans text-sm/[1.125rem] 
              md:text-base/[1.375rem]  text-light-400">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
