import React from 'react';
import { GrConnect } from 'react-icons/gr';
import MagicBean from '../MagicBean';

const IntegratedSection = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h3 className="text-lg items-center font-light tracking-widest select-none flex gap-2 text-white">
        <GrConnect className="text-xl" /> Terintegrasi dengan
      </h3>
      <p className="text-light-500 font-light tracking-widest select-none flex gap-2">
        Ecommerce dan Teknologi Terkini
      </p>
      <MagicBean />
    </div>
  );
};

export default IntegratedSection;
