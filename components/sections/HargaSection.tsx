'use client';
import React from 'react';
import PlanSelector from '../subscription/PlanSelector';

const HargaSection = () => {
  return (
    <section
      aria-label="Harga Section"
      id="harga"
      className="relative w-full flex flex-col justify-center items-center max-w-screen-xl mx-auto lg:items-start text-center text-white z-10 py-10 lg:py-0">
      <div
        className="pointer-events-none transition-all absolute left-1/2 top-1/2 h-full w-[120vw] -translate-x-1/2 -translate-y-1/2 blur-3xl -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_45%)]"
        aria-hidden="true"
      />
      <header className="space-y-3 mb-3 flex flex-col items-center w-full max-w-screen-xl justify-center ">
        <div className="tracking-widest text-neutral-400 flex items-center gap-2 text-sm">
          <span>[</span> <span>Paket Harga</span> <span>]</span>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-2">
          <h2 className="lg:whitespace-nowrap tracking-tight w-fit px-5 text-center lg:text-start lg:px-0 text-3xl __gradient_text font-bold">
            Pilih Paket yang Sesuai untuk
          </h2>
          <h2 className="lg:whitespace-nowrap tracking-tight w-fit px-5 text-center lg:text-start lg:px-0 text-3xl __gradient_text font-bold">
            Skala Bisnis Anda
          </h2>
        </div>
      </header>
      <PlanSelector selectedPlan={null} onSelectPlan={() => {}} />
    </section>
  );
};

export default HargaSection;
