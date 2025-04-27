/* eslint-disable @typescript-eslint/no-unused-vars */
import { IntegratedIcon } from '@/constans';
import AGrid from '@/assets/icons/Agrid.png';
import Image from 'next/image';
import React from 'react';
import { GrConnect } from 'react-icons/gr';
import { InfiniteMovingCards } from './ui/infinite-moving-cards';

const Integrated = () => {
  return (
    <section className="lg:my-60 mb-32 relative pb-20 py-10 w-full flex flex-col justify-center items-center border-y-[1px] border-white/10">
      <h3 className="text-lg items-center font-light tracking-widest select-none flex gap-2 text-white">
        <GrConnect className="text-xl" /> Terintegrasi dengan
      </h3>
      <p className="text-light-500 font-light tracking-widest select-none flex gap-2">
        Ecommerce dan Teknologi Terkini
      </p>
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

export default Integrated;
