/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import AccountDropdown from './app/AccountDropdown';
import HideShowText from './HideShowText';
import { IoMdLogOut } from 'react-icons/io';

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
  // Greeting function (unchanged)
  function getGreeting(): string {
    const currentHour = new Date().getHours();
    if (currentHour >= 4 && currentHour < 12) {
      return 'Selamat Pagi 🌅';
    } else if (currentHour >= 12 && currentHour < 15) {
      return 'Selamat Siang 🌤️';
    } else if (currentHour >= 15 && currentHour < 18) {
      return 'Selamat Sore 🌇';
    } else {
      return 'Selamat Malam 🎑';
    }
  }

  const greeting = getGreeting();
  const user = authDetails?.user;

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-center items-center z-50 shadow-md border-b-[1px] border-white/10 bg-dark-800">
      <div className="max-w-screen-xl flex items-center justify-between w-full text-white border-x-[1px] border-white/10 py-3 px-5">
        <div className="flex items-center gap-2 lg:gap-4 __gradient_text">
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
          <div className="w-0.5 h-7 bg-white/10 rotate-12" />
          <span className="text-white/40 hover:text-white/70 select-none">App Center</span>

          {type === 'license' && license?.key && (
            <>
              <div className="w-0.5 h-7 bg-white/10 rotate-12" />
              <HideShowText text={license.key} />
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-6">
          <AccountDropdown
            handleLogout={handleLogout}
            type={type}
            role={role}
            user={type === 'account' ? user : null}
            license={type === 'license' ? license : null}
          />
        </div>
      </div>
    </nav>
  );
}
