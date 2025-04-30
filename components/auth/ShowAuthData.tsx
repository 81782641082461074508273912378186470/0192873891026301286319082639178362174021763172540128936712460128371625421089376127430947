/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GrLicense } from 'react-icons/gr';

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
}

interface FieldConfig {
  key: string;
  label: string;
  format?: (value: any) => string;
}

const renderKeyValue = (label: string, value: any) => (
  <div key={label} className="flex w-full justify-between my-2 pb-2 border-b border-white/10">
    <p className="text-sm font-light select-none text-white/70">{label}</p>
    <p className="text-sm font-medium text-white select-none">{value ?? 'N/A'}</p>
  </div>
);

const renderFields = (data: any, fields: FieldConfig[]) =>
  fields.map(({ key, label, format }) => {
    const value = data[key];
    const displayValue = format ? format(value) : value;
    return renderKeyValue(label, displayValue);
  });

const ShowAuthData = ({ authData }: { authData: AuthData }) => {
  const { type } = authData;

  const accountFields: FieldConfig[] = [
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
    { key: 'whatsappNumber', label: 'WhatsApp Number' },
    { key: 'isActive', label: 'Active', format: (value: boolean) => (value ? 'Yes' : 'No') },
  ];

  const licenseFields: FieldConfig[] = [
    { key: 'key', label: 'License Key' },
    { key: 'adminId', label: 'Admin ID' },
    { key: 'status', label: 'Status' },
    { key: 'expiresAt', label: 'Expires At' },
    { key: 'generatedAt', label: 'Generated At' },
  ];

  const deviceInfoFields: FieldConfig[] = [
    { key: 'deviceName', label: 'Device Name' },
    { key: 'platform', label: 'Platform' },
    { key: 'architecture', label: 'Architecture' },
    { key: 'cpuCores', label: 'CPU Cores' },
    { key: 'osVersion', label: 'OS Version' },
    { key: 'totalMemory', label: 'Total Memory' },
    { key: 'graphicsCard', label: 'Graphics Card' },
    { key: 'totalStorage', label: 'Total Storage' },
    { key: 'deviceUniqueID', label: 'Device Unique ID' },
  ];

  const LicenseDetails = () => {
    return (
      <div className="group transition-opacity w-full duration-300 relative flex flex-col p-5 bg-black hover:bg-gradient-to-tr hover:from-dark-700 hover:from-5% hover:via-dark-800 hover:via-50% hover:to-dark-800 hover:to-90% text-white border-[1px] lg:border-l-[0.5px] hover:border-[0.5px] border-dark-600 hover:border-dark-200 transition-all duration-300">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
        <div className="flex w-full justify-between items-start mb-10">
          <GrLicense className="text-3xl text-white/80" />
          <div className="tracking-widest text-light-700 font-thin flex items-center gap-2 text-sm">
            <span>[</span> <span>License Details</span> <span>]</span>
          </div>
        </div>

        <div className="z-40 w-full">{renderFields(authData.license, licenseFields)}</div>
      </div>
    );
  };
  const DeviceInfo = ({ deviceInfo }: any) => {
    return (
      <div className="group transition-opacity w-full duration-300 relative flex flex-col p-5 bg-black hover:bg-gradient-to-tr hover:from-dark-700 hover:from-5% hover:via-dark-800 hover:via-50% hover:to-dark-800 hover:to-90% text-white border-[1px] lg:border-l-[0.5px] hover:border-[0.5px] border-dark-600 hover:border-dark-200 transition-all duration-300">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />

        <div className="flex w-full justify-between items-start mb-10">
          <GrLicense className="text-3xl text-white/80" />
          <div className="tracking-widest text-light-700 font-thin flex items-center gap-2 text-sm">
            <span>[</span> <span>Informasi Perangkat</span> <span>]</span>
          </div>
        </div>
        <div className="z-40 w-full">{renderFields(deviceInfo, deviceInfoFields)}</div>
      </div>
    );
  };
  const AccountInfo = () => {
    return (
      <div className="group transition-opacity w-full duration-300 relative flex flex-col p-5 bg-black hover:bg-gradient-to-tr hover:from-dark-700 hover:from-5% hover:via-dark-800 hover:via-50% hover:to-dark-800 hover:to-90% text-white border-[1px] lg:border-l-[0.5px] hover:border-[0.5px] border-dark-600 hover:border-dark-200 transition-all duration-300">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />

        <div className="tracking-widest text-light-800 flex items-center gap-2 text-xl mb-10">
          <span>[</span> <span>Informasi User</span> <span>]</span>
        </div>
        <div className="z-40 w-full">{renderFields(authData.user, accountFields)}</div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-screen-xl z-40">
      <div className="flex flex-col md:flex-row justify-center p-5 lg:p-0 items-start gap-5 xl:gap-10 shadow-xl shadow-black/50 backdrop-blur z-40">
        {type === 'account' && authData.user && <AccountInfo />}

        <LicenseDetails />
        {type === 'license' && authData.license && (
          <>
            {authData.license.deviceInfo && <DeviceInfo deviceInfo={authData.license.deviceInfo} />}
          </>
        )}
      </div>

      <svg
        id="A"
        data-name="A"
        fill="#fff"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 4389.67 5000"
        className="w-auto h-[125%] absolute -bottom-20 -left-[90%] lg:left-10 -z-10 opacity-5">
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
    </div>
  );
};

export default ShowAuthData;
