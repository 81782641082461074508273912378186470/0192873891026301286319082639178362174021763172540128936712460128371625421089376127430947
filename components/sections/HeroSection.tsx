'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import { useState, useRef } from 'react';
import grid from '@/assets/images/perspectivegrid.svg';
import { IoMdArrowDropright, IoMdArrowDropleft } from 'react-icons/io';
import DownloadButton from '../DownloadButton';
import { DiWindows, DiApple } from 'react-icons/di';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { autolakuScreenshots } from '@/constans';

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <section aria-label="Hero Section" className="relative w-full min-h-screen bg-black">
      <Image
        src={grid}
        alt="Latar belakang grid perspektif dekoratif untuk bagian hero Autolaku"
        fill
        className="absolute inset-0 pointer-events-none object-cover opacity-30"
        loading="lazy"
        style={{
          background:
            'linear-gradient(to right, rgba(80, 228, 254, 0.05), rgba(243, 190, 255, 0.05), rgba(195, 211, 246, 0.05), rgba(197, 255, 249, 0.05), rgba(245, 151, 255, 0.05))',
          mask: 'radial-gradient(at center top, black, transparent 90%)',
          WebkitMask: 'radial-gradient(at center top, black, transparent 90%)',
        }}
      />
      <div className="max-w-screen-xl mx-auto flex flex-col lg:items-start justify-start min-h-screen text-center  text-white z-10 pt-16 px-5 2xl:px-0 lg:mt-28">
        <div className="flex justify-center items-center w-full">
          <div className="flex flex-col justify-center mb-5">
            <h1 className="lg:text-7xl md:text-5xl text-3xl font-extrabold mb-2">
              <span className="__gradient_text">Dropship ribet</span>
              <br />
              <span className="__gradient_text">bikin kalah saing?</span>
            </h1>
            <h2 className="lg:text-4xl md:text-xl justify-center lg:justify-start flex text-light-300">
              Sekarang bisa
              <strong className="flex flex-col items-center justify-center mx-2 text-white">
                cepat & efisien
                <div className="brush-underline" />
              </strong>
              tanpa alat lain.
            </h2>
          </div>
        </div>

        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          modules={[Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          className="w-full rounded-t-xl lg:rounded-t-3xl border-x border-t-[1px] border-white/20 mt-10 bg-white/10 backdrop-blur-sm shadow-white/20">
          {autolakuScreenshots.map((screenshot, index) => (
            <SwiperSlide key={index}>
              <Image
                src={screenshot.image}
                alt={`Autolaku screenshot: ${screenshot.title}`}
                className="w-full h-auto object-contain select-none p-5 md:p-10"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-t from-black/90 from-5% via-black/30 via-20% to-transparent to-90% z-30 pointer-events-none" />
        </Swiper>
        <div className="flex justify-between items-end gap-5 w-full pt-10 p-5 lg:p-10 border-x border-b-[1px] rounded-b-xl lg:rounded-b-3xl bg-black/15 backdrop-blur-sm border-white/20">
          <span className="w-full text-start">
            <h4 className="md:text-lg text-sm font-semibold text-white">
              {autolakuScreenshots[currentIndex].title}
            </h4>
            <p className="md:text-sm text-xs text-light-700">
              {autolakuScreenshots[currentIndex].description}
            </p>
          </span>
          <button
            className=" transform rounded-button !p-2 md:!p-3"
            onClick={() => {
              const newIndex = currentIndex > 0 ? currentIndex - 1 : autolakuScreenshots.length - 1;
              setCurrentIndex(newIndex);
              swiperRef.current?.slideTo(newIndex);
            }}
            aria-label="Previous screenshot">
            <IoMdArrowDropleft className="md:text-2xl" />
          </button>{' '}
          <button
            className=" transform rounded-button !p-2 md:!p-3"
            onClick={() => {
              const newIndex = currentIndex < autolakuScreenshots.length - 1 ? currentIndex + 1 : 0;
              setCurrentIndex(newIndex);
              swiperRef.current?.slideTo(newIndex);
            }}
            aria-label="Next screenshot">
            <IoMdArrowDropright className="md:text-2xl" />
          </button>
        </div>
        <div className="w-full flex items-start justify-center md:justify-end">
          <div className="flex flex-col w-fit justify-center items-center mt-5 gap-1">
            <div className="tracking-widest text-neutral-400 flex items-center gap-2 text-sm">
              <span>[</span> <span>Download Sekarang</span> <span>]</span>
            </div>
            <div className="flex gap-3 bg-dark-700 backdrop-blur-sm border-2 border-white/10 rounded-full p-3">
              <DownloadButton
                className="!bg-white rounded-full focus:ring-2 focus:ring-white hover:!bg-white/80 hover:shadow-lg"
                downloadUrl="/api/download?platform=macos"
                buttonText={
                  <div className="flex gap-2 text-black text-sm lg:text-xl items-center">
                    <DiApple className="text-xl lg:text-2xl" /> MacOS
                  </div>
                }
                aria-label="Download for MacOS"
              />
              <DownloadButton
                className="!bg-blue-600 rounded-full focus:ring-2 focus:ring-white hover:!bg-blue-500 hover:shadow-lg"
                downloadUrl="/api/download?platform=windows"
                buttonText={
                  <div className="flex gap-2 text-white text-sm lg:text-xl items-center ">
                    <DiWindows className="text-xl lg:text-2xl" /> Windows
                  </div>
                }
                aria-label="Download for Windows"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
