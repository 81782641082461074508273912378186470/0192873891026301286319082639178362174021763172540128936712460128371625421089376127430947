/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IoMdLogOut } from 'react-icons/io';
import { BiSolidUserDetail } from 'react-icons/bi';

interface AccountDropdownProps {
  type: 'account' | 'license' | null;
  user: any;
  license: any;
  handleLogout: () => void;
}

export default function AccountDropdown({
  type,
  user,
  license,
  handleLogout,
}: AccountDropdownProps) {
  const [open, setOpen] = useState(false);

  const displayName = type === 'account' && user?.name && user.name;

  const secondaryInfo =
    type === 'account' && user?.email
      ? user.email
      : type === 'license' && license?.deviceName
      ? `Device: ${license.deviceName}`
      : 'No secondary info';

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="cursor-pointer bg-white/10 rounded-sm px-2 py-1">
        {/* {displayName ? (
          <p className="text-sm rounded-button">{displayName}</p>
        ) : (
          <button className="p-2! flex! items-center justify-center rounded-button">
            <BiSolidUserDetail className="text-xl lg:text-3xl" />
          </button>
        )} */}
        {displayName && <p className="text-sm rounded-button">{displayName}</p>}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 !border-[1px] border-white/20 bg-dark-800 rounded-xl"
        align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold __gradient_text">{displayName}</p>
            <p className="text-xs text-white/70">{secondaryInfo}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            onClick={handleLogout}
            className="flex! gap-1! items-center! rounded-button bg-red-500/20! text-red-500!">
            <IoMdLogOut className="text-lg" /> Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
