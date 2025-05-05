/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IoMdLogOut } from 'react-icons/io';
import { MdAlternateEmail, MdOutlineMail } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { GrLicense } from 'react-icons/gr';

interface AccountDropdownProps {
  type: 'account' | 'license' | null;
  user: any;
  handleLogout: () => void;
}

export default function AccountDropdown({ type, user, handleLogout }: AccountDropdownProps) {
  const [open, setOpen] = useState(false);

  const displayName = type === 'account' && user?.name && user.name;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className="cursor-pointer bg-white/10 rounded-sm px-2 py-1 text-xs">
        {displayName && <p className="text-sm rounded-button">{displayName}</p>}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-fit !border-[1px] border-white/10 bg-dark-800 mt-2"
        align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold __gradient_text">{displayName}</p>
            {type === 'account' && user && (
              <div className="text-xs flex flex-col font-light tracking-widest text-white/70 gap-0.5">
                <p className="flex gap-1 items-center">
                  <MdAlternateEmail /> {user.username}
                </p>
                <p className="flex gap-1 items-center">
                  <MdOutlineMail /> {user.email}
                </p>
                <p className="flex gap-1 items-center">
                  <FaWhatsapp /> {user.whatsappNumber}
                </p>
                <p className="flex gap-1 items-center">
                  <GrLicense /> {user.licenseLimit} Limit
                </p>
              </div>
            )}
            {/* License Details */}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <button
          onClick={handleLogout}
          className="flex gap-0.5 items-center text-xs justify-center items-center !w-full !rounded-none rounded-button hover:!bg-red-500/25 hover:!text-red-500 hover:!border-[1px] hover:!border-red-500/30 duration-300 transition-all">
          <IoMdLogOut className="text-lg" /> Logout
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
