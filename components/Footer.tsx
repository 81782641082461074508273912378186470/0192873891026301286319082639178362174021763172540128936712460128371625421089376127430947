'use client';
import Link from 'next/link';
import React from 'react';
import { RiTwitterXFill } from 'react-icons/ri';
import { RiFacebookCircleLine } from 'react-icons/ri';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa6';
import DownloadButton from './DownloadButton';
import { DiApple, DiWindows } from 'react-icons/di';
import { HiDownload } from 'react-icons/hi';
import { ADotted, navButtons } from '@/constans';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const contacts = [
    {
      title: 'X (Formerly Twitter)',
      icon: <RiTwitterXFill />,
      url: '#',
    },
    {
      title: 'Whatsapp',
      icon: <FaWhatsapp />,
      url: 'https://wa.me/6285133319998',
    },
    {
      title: 'Facebook',
      icon: <RiFacebookCircleLine />,
      url: '#',
    },
    {
      title: 'Email',
      icon: <MdOutlineAlternateEmail />,
      url: 'mailto:support@autolaku.com',
    },
  ];
  const pathname = usePathname();
  console.log(pathname);
  const pricingAndFeatures = navButtons.filter(
    (button) => button.title === 'Paket Harga' || button.title === 'Fitur'
  );
  const Helps = navButtons.filter(
    (button) =>
      button.title === 'Pusat Bantuan' ||
      button.title === 'FAQ' ||
      button.title === 'Hubungi Kami' ||
      button.title === 'Blog'
  );
  const Informations = navButtons.filter(
    (button) =>
      button.title === 'Ketentuan Layanan' ||
      button.title === 'Pusat Bantuan' ||
      button.title === 'Kebijakan Privasi'
  );

  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full flex justify-center items-center z-50 shadow-md bg-gradient-to-tr from-dark-700 from-10% via-black via-50% to-black to-100% mt-20 lg:mt-52">
      <div className="flex flex-col items-center justify-between w-full text-white ">
        {pathname === '/' && (
          <div className="flex relative flex-col h-[400px] justify-center items-center w-full py-32 gap-10 bg-black/80 border-y-[1px] border-white/10 ">
            <h3 className="lg:text-4xl text-3xl font-extrabold mb-5 __gradient_text">
              Dropship ribet <br className="md:hidden" /> berakhir disini!
            </h3>
            <Link
              href="/auth"
              className="px-4 py-2 lg:text-lg bg-white text-black lg:text-white font-bold lg:bg-white/15 rounded hover:bg-white/20">
              Mulai dropship dengan Autolaku
            </Link>
            <div className="absolute right-0 h-full w-fit flex justify-end items-center opacity-15 hover:opacity-25 overflow-hidden">
              {ADotted}
            </div>
          </div>
        )}
        <div className="flex flex-col-reverse lg:flex-row justify-between items-start w-full py-10 gap-20 lg:gap-10 max-w-screen-xl px-5 xl:px-0 ">
          <div className="flex flex-col gap-5 ">
            <div className="flex items-center gap-2 lg:gap-4 __gradient_text opacity-85 select-none">
              <svg
                id="A"
                data-name="A"
                fill="#fff"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 4389.67 5000"
                className="h-auto w-5 lg:w-7 opacity-85">
                <polygon points="2304.85 2826.47 1426.69 5000 0 5000 1813.03 512.61 2304.85 2826.47" />
                <polygon points="3967.92 3015.8 2615.57 3015.8 2513.7 3015.8 1979.25 4338.6 2896.73 4338.6 3037.32 5000 4389.67 5000 3967.92 3015.8" />
                <polygon points="3911.69 2751.24 2559.33 2751.24 1990.26 73.96 2020.14 0 3326.9 0 3911.69 2751.24" />
              </svg>
              <span className="text-xl lg:text-2xl text-white">Autolaku</span>
            </div>
            <p className="text-sm text-white/70">
              Automation Modern untuk Dropshipping yang Cepat & Efisien
            </p>
            <div className="flex gap-3">
              {contacts.map((contact, i) => (
                <Link
                  href={contact.url}
                  target="blank"
                  key={i}
                  title={contact.title}
                  className="text-xl text-white/70 hover:text-white/85">
                  {contact.icon}
                </Link>
              ))}
            </div>
            <p className="text-sm text-white/50">
              &copy; {currentYear} Autolaku. All rights reserved.
            </p>
            <p className="text-sm text-white/50">PT. AUTOLAKU DROPSHIP PINTAR</p>
          </div>
          <div className="flex flex-col-reverse lg:flex-row items-start lg:justify-end w-full gap-10 lg:gap-20 border-b-[1px] border-white/30 pb-20 lg:p-0 lg:border-0">
            <div className="flex  w-fit justify-center items-center gap-1">
              <HiDownload className="text-2xl text-white/60" />
              <div className="mx-2 w-[1px] h-8 bg-white/20" />
              <DownloadButton
                className="!bg-white"
                downloadUrl="/api/download?platform=macos"
                buttonText={
                  <div className="flex gap-2 text-black !text-xs justify-center items-end w-fit">
                    <DiApple className="text-lg" /> MacOS
                  </div>
                }
              />
              <DownloadButton
                className="!bg-blue-500"
                downloadUrl="/api/download?platform=windows"
                buttonText={
                  <div className="flex gap-2 !text-xs !text-white justify-center items-end w-fit">
                    <DiWindows className="text-lg" /> Windows
                  </div>
                }
              />
            </div>
            <div className="flex flex-col gap-3 ">
              <p className="font-mono tracking-widest mb-2 font-light">PRODUK</p>
              {pricingAndFeatures.map((buttons, i) => (
                <Link
                  href={buttons.url}
                  className="hover:underline text-white/60 text-sm hover:text-white"
                  key={i}>
                  {buttons.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 ">
              <p className="font-mono tracking-widest mb-2 font-light">BANTUAN</p>
              {Helps.map((buttons, i) => (
                <Link
                  href={buttons.url}
                  className="hover:underline text-white/60 text-sm hover:text-white"
                  key={i}>
                  {buttons.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 ">
              <p className="font-mono tracking-widest mb-2 font-light">LEGAL</p>
              {Informations.map((buttons, i) => (
                <Link
                  href={buttons.url}
                  className="hover:underline text-white/60 text-sm hover:text-white"
                  key={i}>
                  {buttons.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
