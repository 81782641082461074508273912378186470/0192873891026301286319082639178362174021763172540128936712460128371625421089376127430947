/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAuthDataFromCookie } from '@/components/GetAuthDataFromCookies';
import { HomeWrapper } from '@/components/HomeWrapper';
import React from 'react';

export const metadata = {
  title: 'App Center Autolaku',
  description: 'Autolaku Application Center.',
};

interface AuthData {
  role: string;
  license: string;
  authDetails: any;
  type: string;
}

const page = () => {
  const authData = getAuthDataFromCookie();

  if (!authData) {
    console.log('No authData found');
    return (
      <div className="min-h-screen bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar flex flex-col justify-center items-center">
        <p>Authentication required</p>
      </div>
    );
  }
  // TODO: authData Doesnt Work, But Work in GetAuthDataFromCookies Component
  const { role, license, authDetails, type } = authData as unknown as AuthData;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar flex flex-col justify-center items-center">
      <HomeWrapper>
        Hi
        {authDetails}
      </HomeWrapper>
    </main>
  );
};

export default page;
