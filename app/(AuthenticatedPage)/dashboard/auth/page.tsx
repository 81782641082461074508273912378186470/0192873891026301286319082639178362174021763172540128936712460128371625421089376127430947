import AuthForm from '@/components/auth/AuthForm';
import { ADotted } from '@/constans';
import { generateMetadata } from '@/lib/utils';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Daftar Autolaku Sekarang!',
  description: 'Halaman Autentikasi autolaku.com',
  url: 'https://dashboard.autolaku.co/auth',
  image: 'https://autolaku.com/images/Autolaku-Login.webp',
  keywords: 'Halaman Autentikasi Autolaku,Login, Daftar, License Key, Admin',
});

const Page = () => {
  return (
    <div className="flex flex-col items-center w-full h-screen pt-24 max-w-screen-xl justify-center text-white border-x-[1px] px-10 xl:p-0  border-white/10">
      <AuthForm />
      <div className="w-auto hidden lg:block fixed h-[50%] -bottom-1 -left-20 z-10 opacty-20">
        <ADotted color="#0f0f0f" />
        <div />
      </div>
    </div>
  );
};

export default Page;
