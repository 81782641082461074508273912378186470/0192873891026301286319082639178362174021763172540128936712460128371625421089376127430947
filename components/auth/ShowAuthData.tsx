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
  <div key={label} className="flex justify-between my-2 pb-2 border-b border-white/10">
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

  // Field configurations
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

  return (
    <div className="p-5 border rounded-sm shadow-xl border-white/25 shadow-black/40 bg-black/10 backdrop-blur">
      <h3 className="text-lg font-semibold text-white select-none mb-5">
        {type === 'account' ? 'Account Details' : 'License Details'}
      </h3>
      <div className="grid grid-cols-2 gap-5">
        {type === 'account' && authData.user && renderFields(authData.user, accountFields)}

        {type === 'license' && authData.license && (
          <>
            {renderFields(authData.license, licenseFields)}
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
    </div>
  );
};

export default ShowAuthData;
