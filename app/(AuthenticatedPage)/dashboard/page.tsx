/* eslint-disable @typescript-eslint/no-unused-vars */
import { HomeWrapper } from '@/components/HomeWrapper';
import React from 'react';
import { cookies } from 'next/headers';
import ShowAuthData from '@/components/app/ShowAuthData';

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
    console.log(authData);
    return (
      <main className="min-h-screen w-full bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar flex flex-col justify-center items-center">
        <HomeWrapper>
          <ShowAuthData authData={authData} />
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
