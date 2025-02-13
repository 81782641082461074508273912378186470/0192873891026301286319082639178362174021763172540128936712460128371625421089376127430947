import Image from 'next/image';
import React from 'react';
import grid from '@/assets/images/perspectivegrid.svg';
import DownloadButton from '../DownloadButton';
import { DiWindows } from 'react-icons/di';
import { DiApple } from 'react-icons/di';

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
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center h-full text-center text-white z-10 px-5 gap-16">
        <div className="flex flex-col items-center justify-center">
          <h1 className="lg:text-6xl text-xl font-extrabold mb-4 __gradient_text">
            Dropship ribet bikin kalah saing?
          </h1>
          <p className="lg:text-3xl flex text-light-800 ">
            Sekarang bisa
            <strong className="flex flex-col items-center justify-center mx-2 text-white ">
              cepat & profesional
              <div className="brush-underline" />
            </strong>
            tanpa alat lain.
          </p>
        </div>

        <div className="w-fit flex flex-col justify-center items-center p-5 border-[1px] border-white/15 bg-black/5 backdrop-blur-sm shadow-lg shadow-black/70">
          <h2 className="">
            Unduh Autolaku sekarang untuk dropshipping cepat dan profesional
            <br /> Tersedia untuk macOS dan Windows!
          </h2>
          <div className="mt-5 gap-10 px-5 flex w-full justify-center items-center ">
            <DownloadButton
              downloadUrl="/api/download?platform=macos"
              buttonText={
                <div className="flex gap-2 justify-center items-center w-fit">
                  <DiApple className="text-xl" /> MacOS
                </div>
              }
              downloadingText="Mengunduh..."
            />
            <DownloadButton
              downloadUrl="/api/download?platform=windows"
              buttonText={
                <div className="flex gap-2 justify-center items-center w-fit">
                  <DiWindows className="text-xl" /> Windows
                </div>
              }
              downloadingText="Mengunduh..."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
