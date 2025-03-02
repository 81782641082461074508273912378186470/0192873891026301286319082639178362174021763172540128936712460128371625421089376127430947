import { IntegratedIcon } from '@/constans';
import Image from 'next/image';
import React from 'react';
import { GrConnect } from 'react-icons/gr';

const Integrated = () => {
  const duplicatedIcons = [...IntegratedIcon, ...IntegratedIcon];
  return (
    <div className="my-20 py-10 w-full flex flex-col justify-center items-center">
      <h3 className="text-lg items-center font-light tracking-widest select-none flex gap-2 text-white">
        <GrConnect className="text-xl" /> Terintegrasi dengan
      </h3>
      <p className="text-light-500 font-light tracking-widest select-none flex gap-2">
        Ecommerce dan Teknologi Terkini
      </p>
      <div className="relative w-full overflow-hidden mt-20 ">
        <div className="flex gap-5 lg:gap-20 animate-infinite-scroll will-change-transform">
          {duplicatedIcons.map((icon, i) => (
            <div key={i} className="flex-shrink-0 select-none">
              <Image
                src={icon.image}
                alt={icon.title}
                width={200}
                height={200}
                draggable={false}
                className="lg:h-24 h-10 w-auto opacity-30 select-none drop-shadow-lg"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-5 lg:gap-20 animate-infinite-scroll-right will-change-transform mt-10 lg:mt-20">
          {duplicatedIcons.map((icon, i) => (
            <div key={i} className="flex-shrink-0 select-none">
              <Image
                src={icon.image}
                alt={icon.title}
                width={200}
                height={200}
                draggable={false}
                className="lg:h-24 h-10 w-auto opacity-30 select-none drop-shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrated;
