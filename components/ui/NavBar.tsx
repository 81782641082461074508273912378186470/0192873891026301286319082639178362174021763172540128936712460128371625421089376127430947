'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ALogo from '@/assets/icons/Auto.png';
import Button from '../buttons/Button';
import { navButtons } from '@/constans';
import MobileNav from './MobileNav';
import { CiCircleChevUp } from 'react-icons/ci';

const NavBar = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className="fixed flex flex-col items-center justify-center top-0 left-0 w-full transition-transform duration-500 transform z-10 bg-white">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="w-full gap-16 bg-white text-black flex p-3 px-5 lg:px-20 justify-between duration-1000 items-center __container">
            <Link
              href="/"
              className="flex select-none items-center gap-1 w-fit"
            >
              <Image
                width={60}
                height={60}
                src={ALogo}
                loading="lazy"
                alt="Logo of Autolaku"
                className="duration-700 lg:w-16 lg:h-16 w-10 h-10"
              />
              <h1 className="text-sm lg:text-2xl font-extrabold font-mono tracking-widest">
                Autolaku
              </h1>
            </Link>
            <div className="flex justify-end items-center gap-3 font-mono">
              <Button label="Mulai Sekarang" variant="primary" size="small" />
            </div>
          </div>
          <div className="w-full gap-10 lg:flex justify-between hidden duration-1000 items-center border-white border-b border-x">
            <div className="flex w-full justify-center items-center bg-black backdrop-blu">
              <div className=" w-full flex justify-center items-center text-white text-xs xl:text-sm __container">
                {navButtons.map((button, index) => (
                  <Link
                    key={index}
                    href={button.url}
                    className="hover:bg-white py-2 px-5 xl:px-10 hover:text-black"
                  >
                    {button.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="lg:hidden fixed bottom-0 right-0 mb-10 z-50 flex justify-center w-full items-center">
        <div className="flex w-fit justify-center items-center border-[1px] border-dark-200 rounded shadow-2xl shadow-black bg-white/70 backdrop-blur-sm">
          <button onClick={scrollToTop} className="duration-500 hover:bg-white">
            <CiCircleChevUp className="duration-500 text-black text-2xl m-3 " />
          </button>
          <MobileNav />
        </div>
      </div>
    </>
  );
};

export default NavBar;
