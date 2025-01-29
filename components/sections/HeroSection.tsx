import Image from 'next/image';
import React from 'react';
import grid from '@/assets/images/perspectivegrid.svg';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[600px] bg-gradient-to-t from-black via-white/10 to-black lg:-mt-10 ">
      <Image
        src={grid}
        layout="fill"
        objectFit="cover"
        className="absolute top-0 left-0 w-full h-full opacity-20 select-none"
        alt="Autolaku | Grid Picture"
        draggable={false}
      />
      {/* <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center h-full text-center text-white z-10 px-5">
        <h1 className="text-4xl font-bold mb-4">Lorem Ipsum</h1>
        <p className="text-sm mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">LOREM IPSUM</h2>
            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">TURBOPACK</h2>
            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
        <div className="mt-8 text-sm">
          <p>TRUSTED BY TEAMS FROM AROUND THE WORLD</p>
          <div className="flex justify-center space-x-4 mt-2">
            <span>Vercel</span>
            <span>AWS</span>
            <span>Microsoft</span>
            <span>NETFLIX</span>
            <span>Disney</span>
            <span>Adobe</span>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default HeroSection;
