/* eslint-disable @typescript-eslint/no-unused-vars */
import { IntegratedIcon } from '@/constans';
import AGrid from '@/assets/icons/Agrid.png';
import Image from 'next/image';
import React from 'react';
import { InfiniteMovingCards } from '../ui/infinite-moving-cards';

const InfiniteLogoSection = () => {
  return (
    <section
      className="mb-32 relative pb-20 py-10 w-full flex flex-col justify-center items-center border-y-[1px] border-white/10"
      style={{
        background:
          'linear-gradient(to right, rgba(255, 99, 8, 0.1), rgba(255, 99, 8, 0.1), rgba(189, 201, 230, 0.1), rgba(151, 196, 255, 0.1), rgba(151, 196, 255, 0.1))',
        mask: 'radial-gradient(at center top, black, transparent 90%)',
        WebkitMask: 'radial-gradient(at center top, black, transparent 90%)',
      }}>
      <div className="relative w-full overflow-hidden mt-10 lg:mt-28">
        <InfiniteMovingCards items={IntegratedIcon} direction="right" speed="normal" />
        <InfiniteMovingCards items={IntegratedIcon} direction="left" speed="fast" />
      </div>
      <div className="absolute bottom-0 left-0 -ml-10 h-full w-auto hidden lg:flex justify-end items-center opacity-20 hover:opacity-40 duration-700 overflow-hidden z-40">
        <Image
          src={AGrid}
          alt="Autolaku.com"
          width={500}
          height={500}
          className="h-[100%] w-auto"
        />
      </div>
    </section>
  );
};

export default InfiniteLogoSection;
