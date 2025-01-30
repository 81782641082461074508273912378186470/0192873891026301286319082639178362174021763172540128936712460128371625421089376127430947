'use client';

import Daftar from '@/components/auth/Daftar';
import Login from '@/components/auth/Login';
import React, { useState } from 'react';
import robot from '@/assets/images/robot.webp';
import Image from 'next/image';

const Page = () => {
  const [activeSection, setActiveSection] = useState<'login' | 'daftar'>('login');

  const toggleSection = (section: 'login' | 'daftar') => {
    setActiveSection(section);
  };

  return (
    <div className="flex flex-col items-center w-full h-screen mt-24 max-w-screen-xl justify-center text-white border-x-[1px] border-b-[1px] px-10 xl:p-0  border-white/10">
      <div className="flex  w-full h-[650px]">
        {/* Information */}
        <div className="lg:flex w-full hidden p-10 border-y-[1px] border-l-[1px] xl:border-l-0 border-white/10 relative ">
          <div className="relative -mt-16 -ml-10">
            <div className="bottom-0 left-0 border-l-[1px] border-white/50 h-10 -mb-5" />
            <div className="bottom-0 left-0 border-b-[1px] border-white/50 w-10 -ml-5" />
          </div>
          <div className="text-white text-xs lg:text-base font-extralight text-white/80 lg:p-0 pl-32 text-end lg:text-justify ml-5 lg:m-0 mb-10">
            <p>
              Menggunakan banyak alat terpisah atau metode manual untuk dropshipping hanya
              memperlambat Anda. Di dunia yang semakin cepat ini, kita perlu alat yang efisien dan
              sederhana. Autolaku adalah pilihan tepat dengan kemudahan penggunaan yang luar biasa.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black to-transparent -z-10"></div>
          <Image
            src={robot}
            alt="Autolaku"
            objectFit="cover"
            width={750}
            height={750}
            className="-z-20 absolute bottom-0 left-0 h-[85%] w-auto"
          />
        </div>
        {/* Form */}
        <div className="w-full flex flex-col justify-start border-[1px] xl:border-r-0 border-white/10 ">
          <div className="flex flex-col w-full h-fit items-center justify-center">
            <div className="flex w-full items-center justify-between">
              <div className="w-10 h-10 " />
              <div className="flex w-full h-10 justify-center items-center border-[1px] border-y-0 border-white/10">
                <h2 className="font-semibold text-sm lg:text-base text-center">
                  {activeSection === 'daftar'
                    ? 'Dropshipping Efisien mulai dari sini.'
                    : 'Lanjutkan perjalanan dropshipping Anda di sini.'}
                </h2>
              </div>
              <div className="w-10 h-10 " />
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="w-10 h-10 border-y-[1px] border-white/10" />
              <div className="flex w-full h-10 justify-center items-center border-[1px] border-white/10">
                <p className="font-extralight text-center text-white/70 text-xs lg:text-sm">
                  {activeSection === 'daftar'
                    ? 'Daftar Sekarang!'
                    : 'Masuk untuk melanjutkan keberhasilan Anda.'}
                </p>
              </div>
              <div className="w-10 h-10 border-y-[1px] border-white/10" />
            </div>
          </div>

          <div className="h-full  flex flex-col justify-center items-center p-10 relative">
            <button
              onClick={() => toggleSection(activeSection === 'daftar' ? 'login' : 'daftar')}
              className="absolute top-0 right-0 m-5 px-4 py-2 hover:bg-white/10 rounded-[5px]">
              {activeSection === 'daftar' ? 'Masuk' : 'Daftar'}
            </button>
            {activeSection === 'login' ? <Login /> : <Daftar />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
