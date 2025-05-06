/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HomeWrapper } from '@/components/HomeWrapper';
import React from 'react';
import { cookies } from 'next/headers';
import ShowAuthData from '@/components/app/ShowAuthData';
import { ADotted } from '@/constans';
import { getRandomGreeting } from '@/lib/utils';
import LicenseGenerator from '@/components/app/LicenseGenerator';
import LicenseList from '@/components/app/LicenseList';

export const metadata = {
  title: 'Dashboard Autolaku',
  description: 'Autolaku Dashboard Panel.',
  manifest: '/manifest-dashboard.json',
};

interface UserDetails {
  username: string;
  role: string;
  email: string;
  name: string;
  whatsappNumber: string;
  licenseLimit: number;
  isActive: boolean;
}

interface DeviceInfo {
  deviceName: string;
  platform: string;
  architecture: string;
  cpuCores: number;
  osVersion: string;
  totalMemory: string;
  graphicsCard: string;
  totalStorage: string;
  deviceUniqueID: string;
}

interface LicenseDetails {
  name: string;
  key: string;
  adminId: null | string;
  deviceInfo: DeviceInfo;
  status: string;
  expiresAt: null | string;
  generatedAt: string;
}

interface AuthData {
  type: 'account' | 'license';
  role: string;
  licenseKey?: string;
  license?: LicenseDetails;
  user?: UserDetails;
  token?: string;
}

const Page = async () => {
  const cookieStore = await cookies();
  const authDataCookie = cookieStore.get('authData')?.value;

  if (!authDataCookie) {
    // console.log('No authData cookie found');
    return (
      <div className="min-h-screen bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar flex flex-col justify-center items-center">
        <p>Dibutuhkan Autentikasi</p>
      </div>
    );
  }

  try {
    const authData: AuthData = JSON.parse(authDataCookie);
    console.log('AuthData app/(AuthPage)/dashboard/page.tsx', authData);
    const name = () => {
      if (authData.type === 'account') {
        return authData.user?.name;
      } else if (authData.type === 'license') {
        return authData.license?.name;
      } else {
        // console.log('AuthData app/(AuthPage)/dashboard/page.tsx', authData);
      }
    };

    const greeting = getRandomGreeting(name() as string);

    return (
      <main className="min-h-screen w-full overflow-hidden text-white relative selection:bg-white/65 selection:text-black no-scrollbar flex flex-col justify-start items-center bg-gradient-to-t from-white/10 from-5% via-transparent via-50% to-black to-100%">
        <HomeWrapper>
          <div className="w-full flex flex-col border-[1px] border-white/10 py-24 lg:py-32 px-5 xl:px-0 gap-10 justify-center items-center max-w-screen-xl">
            <p className="text-neutral-100 font-thin tracking-widest text-xs lg:text-sm w-full text-center p-2">
              {greeting}
            </p>
            <div className="flex gap-10 w-full justify-center items-center flex-col lg:flex-row">
              {/* {authData.type === 'account' &&
                authData.user?.licenseLimit !== undefined &&
                licenses.length < authData.user.licenseLimit && <LicenseGenerator />} */}

              {authData.user?.role === 'admin' && <LicenseList />}
            </div>
          </div>
          {/* <ShowAuthData authData={authData} /> */}
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <ADotted />
          </div>
        </HomeWrapper>
      </main>
    );
  } catch (error) {
    console.error('Failed to parse authData cookie:', error);
    return (
      <div className="min-h-screen bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar flex flex-col justify-center items-center">
        <p>Invalid authentication data</p>
      </div>
    );
  }
};

export default Page;
