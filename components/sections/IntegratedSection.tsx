import React from 'react';
import MagicBean from '../MagicBean';

const IntegratedSection = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <header className="space-y-8 mb-5 flex flex-col items-center w-full max-w-screen-xl justify-center ">
        <div className="tracking-widest text-neutral-400 flex items-center gap-2 text-sm">
          <span>[</span> <span>Powered By</span> <span>]</span>
        </div>
        <h2 className="lg:whitespace-nowrap tracking-tight w-fit px-5 text-center lg:text-start lg:px-0 text-3xl __gradient_text font-bold">
          Ecommerce dan Teknologi Terkini
        </h2>
      </header>
      <MagicBean />
    </div>
  );
};

export default IntegratedSection;
