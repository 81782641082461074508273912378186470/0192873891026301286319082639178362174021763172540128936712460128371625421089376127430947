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
  console.log('AUTH DATA:\n');
  console.log(JSON.parse(authDataCookie));
  try {
    const authData: AuthData = JSON.parse(authDataCookie);
    const { role, license, authDetails, type } = authData;

    // HELP ME TO MAKE A FUNCTION HERE FOR SHOW THE DETAIL OF DEVICE INFO FROM LICENSE

    // {type === 'license' && license && (
    //   <div className="text-xs font-thin tracking-widest text-white/70">
    //     <p>
    //       <strong>License ID:</strong> {license._id}
    //     </p>
    //     <p>
    //       <strong>License Key:</strong> {license.key}
    //     </p>
    //     <p>
    //       <strong>Admin ID:</strong> {license.adminId || 'N/A'}
    //     </p>
    //     <p>
    //       <strong>Status:</strong> {license.status}
    //     </p>
    //     <p>
    //       <strong>Expires At:</strong> {license.expiresAt || 'N/A'}
    //     </p>
    //     <p>
    //       <strong>Generated At:</strong> {license.generatedAt}
    //     </p>
    //     <p>
    //       <strong>Version:</strong> {license.__v}
    //     </p>
    //     {/* Device Info Subsection */}
    //     {license.deviceInfo && (
    //       <div>
    //         <p>
    //           <strong>Device Info:</strong>
    //         </p>
    //         <p>
    //           <strong>Name:</strong> {license.deviceInfo.deviceName || 'N/A'}
    //         </p>
    //         <p>
    //           <strong>Platform:</strong> {license.deviceInfo.platform || 'N/A'}
    //         </p>
    //         <p>
    //           <strong>Architecture:</strong> {license.deviceInfo.architecture || 'N/A'}
    //         </p>
    //         <p>
    //           <strong>CPU Cores:</strong> {license.deviceInfo.cpuCores || 'N/A'}
    //         </p>
    //         <p>
    //           <strong>OS Version:</strong> {license.deviceInfo.osVersion || 'N/A'}
    //         </p>
    //         <p>
    //           <strong>Total Memory:</strong> {license.deviceInfo.totalMemory || 'N/A'}
    //         </p>
    //         <p>
    //           <strong>Graphics Card:</strong> {license.deviceInfo.graphicsCard || 'N/A'}
    //         </p>
    //         <p>
    //           <strong>Total Storage:</strong> {license.deviceInfo.totalStorage || 'N/A'}
    //         </p>
    //         <p>
    //           <strong>Device Unique ID:</strong>{' '}
    //           {license.deviceInfo.deviceUniqueID || 'N/A'}
    //         </p>
    //       </div>
    //     )}
    //   </div>
    // )}
    return (
      <main className="min-h-screen bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar flex flex-col justify-center items-center">
        <HomeWrapper>Hi, {role || 'User'}</HomeWrapper>
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
