import Image from 'next/image';
import React from 'react';
import grid from '@/assets/images/perspectivegrid.svg';

const HeroSection = () => {
  return (
    <section
      aria-label="Hero Section"
      className="relative w-full h-[600px] bg-gradient-to-t from-black via-white/10 to-black lg:-mt-10">
      <Image
        src={grid}
        layout="fill"
        objectFit="cover"
        className="absolute top-0 left-0 w-full h-full opacity-20 select-none pointer-events-none"
        alt="Autolaku | Grid Picture"
        draggable={false}
      />
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center h-full text-center text-white z-10 px-5">
        <h1 className="lg:text-6xl text-2xl font-extrabold mb-4 __gradient_text">
          Dropship ribet bikin kalah saing?
        </h1>
        <p className="mb-8 lg:text-3xl flex text-white/70 ">
          Sekarang bisa
          <strong className="flex flex-col items-center justify-center mx-2 text-white ">
            cepat & profesional
            <div className="brush-underline" />
          </strong>
          tanpa alat lain.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
