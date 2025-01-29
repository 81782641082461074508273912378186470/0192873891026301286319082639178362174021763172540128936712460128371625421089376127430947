/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navButtons } from '@/constans';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { CiMenuBurger } from 'react-icons/ci';

const MobileNav = () => {
  const path = usePathname();
  return (
    <Drawer>
      <DrawerTrigger className="lg:hidden hover:bg-white focus:outline-none focus:ring-0">
        <CiMenuBurger className="duration-500 text-black text-2xl m-3" />
      </DrawerTrigger>
      <DrawerContent className="bg-white text-black lg:hidden border-t-[1px] border-black/50 px-5 gap-10 focus:outline-none focus:ring-0 ">
        <div className="grid grid-cols-2 w-full h-fit gap-5">
          {navButtons.map((nav, i) => (
            <Link
              href={nav.url}
              key={i}
              className={` w-full flex rounded-sm justify-end text-center items-center md:text-sm font-medium group duration-200 px-2 py-1  ${
                path === nav.url ? 'font-black transition-transform duration-700 ' : ''
              }${
                path === nav.url ? ' text-white bg-black ' : ' hover:text-white hover:bg-black/50'
              }`}
            >
              {nav.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col justify-start items-start pb-10 pt-2 border-t-[1px] border-black/30 gap-2">
          <p className="text-xs tracking-widest text-black">
            Platform Canggih yang Membantu Dropshipper Indonesia Meningkatkan Efisiensi dan
            Keuntungan dengan Teknologi Otomasi.
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNav;
