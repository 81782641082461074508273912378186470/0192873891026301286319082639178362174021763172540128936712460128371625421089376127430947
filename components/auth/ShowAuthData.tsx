/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

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
  <div key={label} className="flex justify-between my-2 pb-2 border-b border-white/10 ">
    <p className="text-sm font-light select-none text-white/50">{label}</p>
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
      <div className="bg-fuchsia-500/30 flex flex-col p-5">
        <h3 className="text-lg font-semibold text-white select-none mb-5">License Details</h3>
        {renderFields(authData.license, licenseFields)}
      </div>
    );
  };

  return (
    <>
      <div className="p-5 border rounded-sm shadow-xl border-white/25 shadow-black/40 bg-black/10 backdrop-blur z-50">
        {type === 'account' && authData.user && renderFields(authData.user, accountFields)}
        <LicenseDetails />
        {type === 'license' && authData.license && (
          <>
            {authData.license.deviceInfo && (
              <>
                <div className="col-span-2 mt-5">
                  <h4 className="text-md font-semibold text-white select-none mb-5">Device Info</h4>
                </div>
                {renderFields(authData.license.deviceInfo, deviceInfoFields)}
              </>
            )}
          </>
        )}
      </div>
      <svg
        id="A"
        data-name="A"
        fill="#fff"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 4389.67 5000"
        className="w-auto h-[125%] absolute -bottom-20 -left-[90%] lg:left-10 z-10 opacity-5">
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
    </>
  );
};

export default ShowAuthData;
