'use client';
import React, { useState } from 'react';
import Login from './Login';
import Daftar from './Daftar';

const AuthForm = () => {
  const [activeSection, setActiveSection] = useState<'login' | 'daftar'>('login');

  const toggleSection = (section: 'login' | 'daftar') => {
    setActiveSection(section);
  };
  return (
    <div className="flex w-full h-fit min-h-[750px]">
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

        <div className="h-full gap-10 flex flex-col justify-center items-center px-10 relative">
          <button
            onClick={() => toggleSection(activeSection === 'daftar' ? 'login' : 'daftar')}
            className="absolute top-0 right-0 m-5 px-4 py-2 hover:bg-white/10 rounded-[5px] border-[0.5px] border-white/20">
            {activeSection === 'daftar' ? 'Masuk' : 'Daftar'}
          </button>
          {activeSection === 'login' ? <Login /> : <Daftar />}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
