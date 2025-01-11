import React from 'react';
import loadinglogo from '@/assets/icons/loading.png';
import Image from 'next/image';
const Loading = ({ text }: { text?: string }) => {
  return (
    <div className="fixed top-0 left-0 z-[100] w-screen h-screen flex flex-col justify-center items-center bg-black">
      <div className="relative flex flex-col items-center justify-center gap-3">
        <div className="w-20 h-20 border-y-[1px] border-y-white/30 border-x-2 border-x-white rounded-full animate-spin"></div>
        <Image
          src={loadinglogo}
          alt="Loading Logo | Dokmai Store"
          width={100}
          height={100}
          loading="lazy"
          className="w-32 h-auto"
        />
      </div>
      <p className="mt-2">{text}</p>
    </div>
  );
};

export default Loading;
