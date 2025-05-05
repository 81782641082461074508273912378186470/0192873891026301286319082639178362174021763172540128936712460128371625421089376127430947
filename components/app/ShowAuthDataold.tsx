/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';
import { GrLicense, GrUserAdmin } from 'react-icons/gr';
import { GoCpu } from 'react-icons/go';
import HideShowText from '../HideShowText';
import CopyToClipboard from '../CopyToClipboard';
import LicenseGenerator from './LicenseGenerator';

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
  format?: (value: any) => any;
}

const renderKeyValue = (label: string, value: any) => (
  <div key={label} className="flex w-full justify-between my-2 pb-2 border-b border-gray-800">
    <p className="text-sm font-light text-gray-400">{label}</p>
    <p className="text-sm font-medium text-gray-200">{value ?? '-'}</p>
  </div>
);

const renderFields = (data: any, fields: FieldConfig[]) =>
  fields.map(({ key, label, format }) => {
    const value = data[key];
    const displayValue = typeof format === 'function' ? format(value) : value;
    return renderKeyValue(label, displayValue);
  });

const InfoCard = ({
  icon,
  title,
  fields,
  data,
  className = '',
}: {
  icon: React.ReactNode;
  title: string;
  fields: FieldConfig[];
  data: any;
  className?: string;
}) => (
  <div
    className={`relative flex flex-col p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-cyan-900/20 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent rounded-xl pointer-events-none" />

    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 text-cyan-400">
        {icon}
      </div>
      <h3 className="text-gray-200 font-medium tracking-wide">{title}</h3>
    </div>

    <div className="z-10 w-full">{renderFields(data, fields)}</div>
  </div>
);

const AccountInfo = ({ user, fields }: { user: UserDetails; fields: FieldConfig[] }) => (
  <InfoCard
    icon={<GrUserAdmin className="text-xl" />}
    title="Account Information"
    fields={fields}
    data={user}
    className="col-span-1 md:col-span-2"
  />
);

const LicenseDetails = ({
  license,
  fields,
}: {
  license: LicenseDetails;
  fields: FieldConfig[];
}) => (
  <InfoCard
    icon={<GrLicense className="text-xl" />}
    title="License Details"
    fields={fields}
    data={license}
    className="col-span-1 md:col-span-2"
  />
);

const DeviceInfo = ({ deviceInfo, fields }: { deviceInfo: DeviceInfo; fields: FieldConfig[] }) => (
  <InfoCard
    icon={<GoCpu className="text-xl" />}
    title="Device Information"
    fields={fields}
    data={deviceInfo}
    className="col-span-1 md:col-span-2"
  />
);

const getStatusStyle = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-400 bg-green-900/30 border-green-700';
    case 'expired':
      return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
    case 'revoked':
      return 'text-red-400 bg-red-900/30 border-red-700';
    default:
      return 'text-gray-400 bg-gray-800 border-gray-700';
  }
};

const BadgeStatus = ({ status }: { status: string }) => (
  <p className={`${getStatusStyle(status)} text-xs px-2 py-1 rounded-md border`}>{status}</p>
);

const ShowAuthData = ({ authData }: { authData: AuthData }) => {
  const { type } = authData;

  const formatLicenseKey = (value: string) => (
    <div className="flex items-center gap-2">
      <HideShowText text={value} /> <CopyToClipboard textToCopy={value} />
    </div>
  );

  const formatStatus = (value: string) => <BadgeStatus status={value} />;

  const formatDeviceUniqueID = (value: string) => {
    if (value) {
      const firstPart = value.slice(0, 5);
      const lastPart = value.slice(-5);
      return (
        <div className="flex items-center gap-2">
          {`${firstPart}...${lastPart}`}
          <CopyToClipboard textToCopy={value} />
        </div>
      );
    }
    return '-';
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '-';
    try {
      return new Date(timestamp)
        .toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .replace(' at ', ', ');
    } catch {
      return '-';
    }
  };

  const accountFields: FieldConfig[] = [
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
    { key: 'whatsappNumber', label: 'WhatsApp' },
  ];

  const licenseFields: FieldConfig[] = [
    { key: 'name', label: 'Name' },
    { key: 'key', label: 'License Key', format: formatLicenseKey },
    { key: 'status', label: 'Status', format: formatStatus },
    { key: 'expiresAt', label: 'Expires', format: formatTime },
    { key: 'generatedAt', label: 'Registration Date', format: formatTime },
  ];

  const deviceInfoFields: FieldConfig[] = [
    { key: 'deviceName', label: 'Device Name' },
    { key: 'platform', label: 'OS' },
    { key: 'architecture', label: 'Architecture' },
    { key: 'cpuCores', label: 'CPU Cores' },
    { key: 'osVersion', label: 'OS Version' },
    { key: 'totalMemory', label: 'RAM' },
    { key: 'graphicsCard', label: 'Graphics Card' },
    { key: 'totalStorage', label: 'Storage' },
    { key: 'deviceUniqueID', label: 'Device Unique ID', format: formatDeviceUniqueID },
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <div className="bg-gray-950 p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {type === 'account' && authData.user && (
            <>
              <AccountInfo user={authData.user} fields={accountFields} />
              <div className="col-span-1 md:col-span-2">
                <LicenseGenerator />
              </div>
            </>
          )}

          {type === 'license' && authData.license && (
            <>
              <LicenseDetails license={authData.license} fields={licenseFields} />
              {authData.license.deviceInfo && (
                <DeviceInfo deviceInfo={authData.license.deviceInfo} fields={deviceInfoFields} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowAuthData;
