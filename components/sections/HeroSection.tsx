/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import React from 'react';
import grid from '@/assets/images/perspectivegrid.svg';
import appScreenshot from '@/assets/images/searchProductSection.png';
import DownloadButton from '../DownloadButton';
import { DiWindows } from 'react-icons/di';
import { DiApple } from 'react-icons/di';

const HeroSection = () => {
  return (
    <section aria-label="Hero Section" className="relative w-full h-[900px] bg-black ">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${grid.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-start h-full text-center text-white z-10 px-5 gap-16 mt-24 lg:mt-32">
        <div className="flex flex-col items-center justify-center">
          <h1 className="lg:text-6xl md:text-5xl text-xl font-extrabold mb-2 __gradient_text">
            Dropship ribet bikin kalah saing?
          </h1>
          <h3 className="lg:text-3xl md:text-xl flex text-light-800">
            Sekarang bisa
            <strong className="flex flex-col items-center justify-center mx-2 text-white">
              cepat & efisien
              <div className="brush-underline" />
            </strong>
            tanpa alat lain.
          </h3>
        </div>
        <div className="relative w-full max-w-3xl h-[500px] -mt-36 md:-mt-24 lg:-mt-20">
          <Image
            src={appScreenshot}
            layout="fill"
            objectFit="contain"
            className="absolute top-0 left-0 z-10"
            alt="Autolaku App Screenshot"
            draggable={false}
          />
        </div>
        <div className="w-full flex-col justify-center items-center gap-5 -mt-44 md:-mt-32 lg:-mt-20">
          <h2 className="text-xs text-justify lg:px-80 text-white/70">
            Autolaku adalah solusi dropshipping premium di Indonesia, mengintegrasikan teknologi AI
            dari xAI dan OpenAI untuk menghasilkan otomatisasi cerdas, termasuk deskripsi produk
            yang optimal, analisis pasar mendalam, dan layanan pelanggan responsif. Dengan dukungan
            Cloudinary untuk pengolahan gambar yang efisien dan aman, Autolaku menyediakan aplikasi
            desktop untuk macOS dan Windows, menjamin dropshipper dapat mengembangkan bisnis mereka
            secara profesional tanpa kompleksitas alat terpisah.
          </h2>
          <div className="flex mt-5 gap-5 justify-center items-center w-full">
            <DownloadButton
              className="!bg-white rounded-full"
              downloadUrl="/api/download?platform=macos"
              buttonText={
                <div className="flex gap-2 text-black text-xs lg:text-xl lg:gap-3 justify-center items-center w-fit">
                  <DiApple className="text-lg" /> MacOS
                </div>
              }
              downloadingText="Mengunduh..."
            />
            <DownloadButton
              className="!bg-blue-500 rounded-full"
              downloadUrl="/api/download?platform=windows"
              buttonText={
                <div className="flex gap-2 text-white text-xs lg:text-xl lg:gap-3 justify-center items-center w-fit">
                  <DiWindows className="text-lg" /> Windows
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
