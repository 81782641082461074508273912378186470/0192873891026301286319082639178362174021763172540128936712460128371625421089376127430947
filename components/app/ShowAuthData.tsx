/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import LicenseCard from './LicenseCard';
import DeviceCard from './DeviceCard';
import LicenseGenerator from './LicenseGenerator';
import { AuthData } from '@/types/auth';
import { GridPattern } from '@/constans';

interface ShowAuthDataProps {
  authData: AuthData;
}

const ShowAuthData: React.FC<ShowAuthDataProps> = ({ authData }) => {
  const { type } = authData;

  return (
    <div className="max-w-screen-xl backdrop-blur-lg shadow-2xl shadow-black/50 overflow-hidden pt-10 flex flex-col items-center">
      <GridPattern />
      <LicenseGenerator />
      <div className="p-6 md:p-8 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-20">
          {type === 'account' && authData.license && <></>}
          {type === 'license' && authData.license && (
            <>
              <LicenseCard license={authData.license} className="lg:col-span-2" />
              {authData.license.deviceInfo && (
                <DeviceCard deviceInfo={authData.license.deviceInfo} className="lg:row-span-1" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowAuthData;
