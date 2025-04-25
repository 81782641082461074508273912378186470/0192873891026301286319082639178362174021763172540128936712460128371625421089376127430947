/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditCard, Settings, User } from 'lucide-react';
import { IoMdLogOut } from 'react-icons/io';
import { BiSolidUserDetail } from 'react-icons/bi';

interface AccountDropdownProps {
  type: 'account' | 'license' | null;
  role: string | null;
  user: any; // User object if type is 'account', else null
  license: any; // License object if type is 'license', else null
  handleLogout: () => void;
}

export default function AccountDropdown({
  type,
  role,
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
        {displayName ? (
          <p className="text-sm rounded-button">{displayName}</p>
        ) : (
          <button className="h-10 w-10 !p-0 !flex items-center justify-center rounded-button">
            <BiSolidUserDetail className="text-xl" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {type === 'account' && role && (
              <p className="text-xs leading-none text-muted-foreground">Role: {role}</p>
            )}
            <p className="text-xs leading-none text-muted-foreground">{secondaryInfo}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            onClick={handleLogout}
            className="!flex !gap-1 !items-center rounded-button !bg-red-500/20 !text-red-500">
            <IoMdLogOut className="text-lg" /> Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
