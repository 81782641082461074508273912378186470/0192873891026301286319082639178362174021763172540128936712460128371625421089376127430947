'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdDocument,
  IoMdHelpCircle,
  IoMdHome,
  IoMdInformationCircle,
  IoMdListBox,
  IoMdMail,
  IoMdPerson,
  IoMdPricetag,
} from 'react-icons/io';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sidebar';
import { MdFormatQuote } from 'react-icons/md';
import { HiMenuAlt4 } from 'react-icons/hi';

const NavBar = () => {
  const [openDropdown, setOpenDropdown] = useState<null | 'pricing' | 'help'>(null);

  const navButtons = [
    {
      title: 'Beranda',
      url: '/',
      icon: <IoMdHome />,
      description: 'Kembali ke halaman utama',
    },
    {
      title: 'Tentang Kami',
      url: '/tentang-kami',
      icon: <IoMdInformationCircle />,
      description: 'Pelajari lebih lanjut tentang kami',
    },
    {
      title: 'Paket Harga',
      url: '/harga',
      icon: <IoMdPricetag />,
      description: 'Lihat berbagai paket harga kami',
    },
    {
      title: 'Fitur',
      url: '/fitur',
      icon: <IoMdListBox />,
      description: 'Jelajahi fitur-fitur yang kami tawarkan',
    },
    {
      title: 'Blog',
      url: '/blog',
      icon: <IoMdDocument />,
      description: 'Baca artikel terbaru dari kami',
    },
    {
      title: 'Pusat Bantuan',
      url: '/bantuan',
      icon: <IoMdHelpCircle />,
      description: 'Dapatkan bantuan dan dukungan',
    },
    {
      title: 'FAQ',
      url: '/faq',
      icon: <MdFormatQuote />,
      description: 'Temukan jawaban atas pertanyaan umum',
    },
    {
      title: 'Hubungi Kami',
      url: '/hubungi-kami',
      icon: <IoMdMail />,
      description: 'Kirim pesan atau hubungi kami',
    },
    {
      title: 'Masuk/Daftar',
      url: '/auth',
      icon: <IoMdPerson />,
      description: 'Buat akun baru/Masuk dengan akun mu',
    },
  ];

  const pricingAndFeatures = navButtons.filter(
    (button) => button.title === 'Paket Harga' || button.title === 'Fitur'
  );
  const helpAndInfo = navButtons.filter(
    (button) =>
      button.title === 'Tentang Kami' ||
      button.title === 'Pusat Bantuan' ||
      button.title === 'FAQ' ||
      button.title === 'Hubungi Kami' ||
      button.title === 'Blog'
  );
  const accountButtons = navButtons.filter(
    (button) => button.title === 'Masuk/Daftar' || button.title === 'Masuk/Daftar'
  );
  const homeButton = navButtons.find((button) => button.title === 'Beranda');

  const toggleDropdown = (dropdown: 'pricing' | 'help' | null) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-center items-center z-50 shadow-md border-b-[1px] border-white/10 bg-dark-800">
      <div className="max-w-screen-xl flex items-center justify-between w-full text-white border-x-[1px] border-white/10 py-3 px-5 ">
        <Link href="/" className="flex items-center gap-2 lg:gap-4 __gradient_text">
          <svg
            id="A"
            data-name="A"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 4389.67 5000"
            className="h-auto w-5 lg:w-7">
            <polygon
              className="cls-1"
              points="2304.85 2826.47 1426.69 5000 0 5000 1813.03 512.61 2304.85 2826.47"
            />
            <polygon
              className="cls-1"
              points="3967.92 3015.8 2615.57 3015.8 2513.7 3015.8 1979.25 4338.6 2896.73 4338.6 3037.32 5000 4389.67 5000 3967.92 3015.8"
            />
            <polygon
              className="cls-1"
              points="3911.69 2751.24 2559.33 2751.24 1990.26 73.96 2020.14 0 3326.9 0 3911.69 2751.24"
            />
          </svg>
          <div className="w-[0.5px] h-8 bg-white/20 rotate-12" />
          <h1 className="text-xl lg:text-4xl text-white ">Autolaku</h1>
        </Link>

        <ul className="hidden lg:flex items-center gap-16">
          {homeButton && (
            <Link href={homeButton.url} aria-label="Home">
              Home
            </Link>
          )}

          {pricingAndFeatures.length > 0 && (
            <li className="relative text-white">
              <button
                className={`hover:text-white flex gap-2 items-center ${
                  openDropdown === 'pricing' ? 'text-white' : 'text-white/70'
                }`}
                onClick={() => toggleDropdown('pricing')}>
                Pricing & Features{' '}
                {openDropdown === 'pricing' ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {openDropdown === 'pricing' && (
                <div className="absolute mt-5 w-fit flex flex-col justify-end shadow-lg p-4 shadow-black bg-dark-800 border-[1px] border-white/10 backdrop-blur rounded ">
                  {pricingAndFeatures.map((button, index) => (
                    <Link
                      key={index}
                      href={button.url}
                      className="flex items-center gap-4 px-4 py-2 rounded group">
                      <span className="border border-white/10 rounded p-2 group-hover:bg-white group-hover:text-black">
                        {React.cloneElement(button.icon, {
                          className: 'text-xl text-white/50 group-hover:text-black',
                        })}
                      </span>
                      <div>
                        <span className="font-semibold text-white/70 group-hover:text-white">
                          {button.title}
                        </span>
                        <p className="text-sm text-white/50 group-hover:text-white/60 whitespace-nowrap">
                          {button.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </li>
          )}

          {helpAndInfo.length > 0 && (
            <li className="relative">
              <button
                className={`hover:text-white flex gap-2 items-center ${
                  openDropdown === 'help' ? 'text-white' : 'text-white/70'
                }`}
                onClick={() => toggleDropdown('help')}>
                Help & Info {openDropdown === 'help' ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {openDropdown === 'help' && (
                <div className="absolute mt-5 w-fit flex flex-col justify-end shadow-lg p-4 shadow-black bg-dark-800 border-[1px] border-white/10 backdrop-blur rounded ">
                  {helpAndInfo.map((button, index) => (
                    <Link
                      key={index}
                      href={button.url}
                      className="flex items-center gap-4 px-4 py-2 rounded group">
                      <span className="border border-white/10 rounded p-2 group-hover:bg-white group-hover:text-black">
                        {React.cloneElement(button.icon, {
                          className: 'text-xl text-white/50 group-hover:text-black',
                        })}
                      </span>
                      <div>
                        <span className="font-semibold text-white/70 group-hover:text-white">
                          {button.title}
                        </span>
                        <p className="text-sm text-white/50 group-hover:text-white/60 whitespace-nowrap">
                          {button.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </li>
          )}
        </ul>

        <div>
          <Link
            href={accountButtons[0]?.url || '#'}
            className="!hidden lg:!flex items-start rounded-button">
            <IoMdPerson className="text-xl" />
            <span>Masuk/Daftar</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="!block lg:!hidden items-center rounded-button !p-2 lg:!p-3"
                title="Mobile screen sidebar menu">
                <HiMenuAlt4 className="lg:text-xl" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-fit">
              <div className="grid gap-4 py-4 mt-5">
                {navButtons.map((button, index) => (
                  <SheetClose asChild key={index}>
                    <Link
                      key={index}
                      href={button.url}
                      className="flex items-center gap-4 py-1 rounded group">
                      <span className="border border-white/10 rounded p-2 group-hover:bg-white group-hover:text-black">
                        {React.cloneElement(button.icon, {
                          className: 'text-white/50 group-hover:text-black',
                        })}
                      </span>
                      <div>
                        <span className="font-semibold text-sm text-white/70 group-hover:text-white">
                          {button.title}
                        </span>
                        <p className="text-xs text-white/50 group-hover:text-white/60 whitespace-nowrap">
                          {button.description}
                        </p>
                      </div>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
