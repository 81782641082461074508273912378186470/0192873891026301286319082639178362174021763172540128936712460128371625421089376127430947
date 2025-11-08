import React from 'react';
import HargaSection from '@/components/sections/HargaSection';

const page = () => {
  return (
    <div className="flex w-full min-h-screen flex-col max-w-screen-xl items-center justify-center overflow-hidden border-y-[1px] border-white/10 px-5 xl:px-0">
      <HargaSection />
    </div>
  );
};

export default page;
