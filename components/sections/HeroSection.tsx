import React from 'react';
import AutoOutline from '@/assets/icons/AutoOutline.png';
import Image from 'next/image';
import Button from '../buttons/Button';

const HeroSection = () => {
  return (
    <section className="flex justify-center items-center w-full h-fit px-5 xl:px-20 lg:max-h-[500px] bg-black gap-52">
      <div className="flex flex-col lg:flex-row text-start items-center">
        <div className="py-10 lg:p-0">
          <h1 className="text-3xl font-bold text-white leading-tight ">
            <span className="text-black bg-white font-bold">
              Automation Modern
            </span>{' '}
            untuk Dropshipping yang <br />
            <span className="text-black bg-white font-bold">
              Cepat
            </span> dan{' '}
            <span className="text-black bg-white font-bold">Efisien!</span>
          </h1>

          <p className="mt-6 text-xs font-light tracking-widest text-gray-300">
            Autolaku adalah platform modern dengan teknologi otomatisasi pintar
            yang dirancang khusus untuk dropshipper Indonesia. Kelola produk,
            pesanan, dan pengiriman dengan mudah dalam satu tempat.
          </p>

          <div className="flex gap-4 justify-start items-center mt-6">
            <Button
              label="Mulai Sekarang"
              url="/harga"
              size="medium"
              variant="secondary"
            />
            <Button
              label="Lihat Fitur"
              url="/fitur"
              size="medium"
              variant="outline"
            />
          </div>
        </div>
        <Image
          src={AutoOutline}
          alt="Dashboard Autolaku"
          width={500}
          height={500}
          className="h-full hidden lg:block"
        />
      </div>
    </section>
  );
};

export default HeroSection;
