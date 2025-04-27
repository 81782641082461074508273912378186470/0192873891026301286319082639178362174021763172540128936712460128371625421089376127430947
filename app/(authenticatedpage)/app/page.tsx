/* eslint-disable @typescript-eslint/no-unused-vars */
import { HomeWrapper } from '@/components/HomeWrapper';
import React from 'react';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'App Center Autolaku',
  description: 'Autolaku Application Center.',
};

interface AuthDetails {
  username?: string;
  [key: string]: unknown;
}

interface AuthData {
  role: string;
  license: string;
  authDetails: AuthDetails;
  type: string;
}

const Page = async () => {
  const cookieStore = await cookies();
  const authDataCookie = cookieStore.get('authData')?.value;

  if (!authDataCookie) {
    console.log('No authData cookie found');
    return (
      <div className="min-h-screen bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar flex flex-col justify-center items-center">
        <p>Authentication required</p>
      </div>
    );
  }
  console.log(JSON.parse(authDataCookie));
  try {
    const authData: AuthData = JSON.parse(authDataCookie);

    const { role, license, authDetails, type } = authData;

    return (
      <main className="min-h-screen bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar flex flex-col justify-center items-center">
        <HomeWrapper>
          Hi, {role || 'User'} {/* Fallback if username is missing */}
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
