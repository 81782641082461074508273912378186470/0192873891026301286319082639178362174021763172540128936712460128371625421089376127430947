/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import AccountDropdown from './AccountDropdown';
import HideShowText from '../HideShowText';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IoMdLogOut } from 'react-icons/io';
import { GrLicense, GrUserAdmin } from 'react-icons/gr';

interface NavDashboardProps {
  role: string | null;
  type: 'account' | 'license' | null;
  license: any;
  authDetails: any;
  handleLogout: () => void;
}

export default function NavDashboard({
  role,
  type,
  license,
  handleLogout,
  authDetails,
}: NavDashboardProps) {
  const user = authDetails?.user;

  const pathname = usePathname();
  if (!pathname.includes('/auth')) {
    return (
      <nav className="fixed top-0 left-0 w-full flex justify-center items-center z-50 shadow-md border-b-[1px] border-white/10 bg-dark-800">
        <div className="max-w-screen-xl flex items-center justify-between w-full text-white border-x-[1px] border-white/10 py-3 px-5">
          <div className="flex items-center gap-2 lg:gap-6 __gradient_text">
            <Link
              href="https://autolaku.com/"
              className="!p-3  hover:bg-dark-700 rounded-full hover:border-white/10 border-transparent border-[1px] text-white/70 hover:text-white">
              <svg
                id="A"
                data-name="A"
                fill="#fff"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 4389.67 5000"
                className="h-auto w-5 lg:w-6">
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
            </Link>

            <div className="w-0.5 h-7 bg-white/10 rotate-12" />
            <span className="text-white/40 hover:text-white/70 select-none text-sm font-bold __gradient_text">
              Dashboard
            </span>
            <div className="w-0.5 h-7 bg-white/10 rotate-12" />
            <span className="flex gap-1 items-center text-white/40 text-xs hover:text-white/70 select-none font-bold __gradient_text">
              {role === 'admin' ? (
                <>
                  <GrUserAdmin className="text-white" /> Admin
                </>
              ) : (
                <>
                  <GrLicense className="text-white" /> User
                </>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            {type === 'license' ? (
              <button
                onClick={handleLogout}
                className="flex gap-0.5 items-center rounded-button hover:!bg-red-500/25 hover:!text-red-500 hover:!border-[1px] hover:!border-red-500/30 duration-300 transition-all">
                <IoMdLogOut className="text-lg" /> Logout
              </button>
            ) : (
              <AccountDropdown
                handleLogout={handleLogout}
                type={type}
                user={user}
                license={license}
              />
            )}
          </div>
        </div>
      </nav>
    );
  }
}
