'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AWhite from '@/assets/icons/AWhite.png';
import { navButtons } from '@/constans';
import { BsPerson } from 'react-icons/bs';
import { RiArrowDownWideFill, RiArrowUpWideFill } from 'react-icons/ri';
const NavBar = () => {
  const [pricingOpen, setPricingOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

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
    (button) => button.title === 'Daftar' || button.title === 'Login'
  );
  const homeButton = navButtons.find((button) => button.title === 'Beranda');

  const togglePricing = () => setPricingOpen((prev) => !prev);
  const toggleHelp = () => setHelpOpen((prev) => !prev);

  return (
    <>
      <nav className="fixed top-0 left-0 w-screen flex justify-center items-center z-50 shadow-md border-b-[1px] border-white/20 bg-black">
        <div className="flex items-center justify-center lg:justify-between p-5 lg:py-5 lg:px-10 __container w-[1900px] bg-black text-white">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={AWhite}
              alt="Autolaku - Automatic Solutions for Your Business"
              width={40}
              height={40}
            />
            <div className="w-[0.1px] h-8 bg-white/50 rotate-12" />
            <h1 className="text-xl font-bold">Autolaku</h1>
          </Link>

          <ul className="hidden lg:flex items-center gap-16">
            {homeButton && (
              <Link href={homeButton.url} aria-label="Home">
                Home
              </Link>
            )}

            {pricingAndFeatures.length > 0 && (
              <li className="relative">
                <button className="hover:underline" onClick={togglePricing}>
                  Pricing & Features{' '}
                  {pricingOpen ? (
                    <RiArrowUpWideFill />
                  ) : (
                    <RiArrowDownWideFill />
                  )}
                </button>
                {pricingOpen && (
                  <ul className="absolute mt-3 bg-black/60 border-[1px] border-white/30 backdrop-blur p-3 rounded shadow-md">
                    {pricingAndFeatures.map((button, index) => (
                      <li key={index}>
                        <Link
                          href={button.url}
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          {button.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}

            {helpAndInfo.length > 0 && (
              <li className="relative">
                <button className="hover:underline" onClick={toggleHelp}>
                  Help & Info
                </button>
                {helpOpen && (
                  <ul className="absolute mt-3 bg-white text-black p-2 rounded shadow-md">
                    {helpAndInfo.map((button, index) => (
                      <li key={index}>
                        <Link
                          href={button.url}
                          className="block px-4 py-2 hover:bg-gray-200"
                        >
                          {button.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}
          </ul>

          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href={accountButtons[0]?.url || '#'}
              className="flex gap-2 items-center"
            >
              <BsPerson className="text-xl" />
              <span>Account</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
