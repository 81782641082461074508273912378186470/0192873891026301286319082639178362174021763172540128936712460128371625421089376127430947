/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GrLicense, GrUserAdmin } from 'react-icons/gr';
import { GoCpu } from 'react-icons/go';
import { ADotted } from '@/constans';
import HideShowText from '../HideShowText';
import CopyToClipboard from '../CopyToClipboard';

// Interfaces (unchanged)
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
}

interface FieldConfig {
  key: string;
  label: string;
  format?: (value: any) => any;
}

const renderKeyValue = (label: string, value: any) => (
  <div key={label} className="flex w-full justify-between my-2 pb-2 border-b border-white/10">
    <p className="text-sm font-light select-none text-white/70">{label}</p>
    <p className="text-sm font-medium text-white select-none">{value ?? '-'}</p>
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
}: {
  icon: React.ReactNode;
  title: string;
  fields: FieldConfig[];
  data: any;
}) => (
  <div className="group transition-opacity shadow-xl shadow-black/50 w-full duration-300 relative flex flex-col p-5 bg-black md:hover:bg-gradient-to-tr md:hover:from-dark-700 md:hover:from-5% md:hover:via-dark-800 md:hover:via-50% md:hover:to-dark-800 md:hover:to-90% text-white border-[1px] lg:border-l-[1px] hover:border-[1px] border-dark-600 hover:border-dark-200 max-sm:bg-gradient-to-tr max-sm:from-dark-700 max-sm:from-5% max-sm:via-dark-800 max-sm:via-50% max-sm:to-dark-800 max-sm:to-90% text-white border-[1px] lg:border-l-[1px] hover:border-[1px] border-dark-600 hover:border-dark-200 transition-all duration-300">
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
    <div className="flex w-full justify-between items-start mb-10">
      {icon}
      <div className="tracking-widest __gradient_text flex items-center gap-2 text-sm">
        <span>[</span> <span>{title}</span> <span>]</span>
      </div>
    </div>
    <div className="z-40 w-full">{renderFields(data, fields)}</div>
  </div>
);

const AccountInfo = ({ user, fields }: { user: UserDetails; fields: FieldConfig[] }) => (
  <InfoCard
    icon={<GrUserAdmin className="text-3xl text-white/80" />}
    title="Informasi Akun"
    fields={fields}
    data={user}
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
    icon={<GrLicense className="text-3xl text-white/80" />}
    title="License Details"
    fields={fields}
    data={license}
  />
);

const DeviceInfo = ({ deviceInfo, fields }: { deviceInfo: DeviceInfo; fields: FieldConfig[] }) => (
  <InfoCard
    icon={<GoCpu className="text-3xl text-white/80" />}
    title="Informasi Perangkat"
    fields={fields}
    data={deviceInfo}
  />
);
const getStatusStyle = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-500 bg-green-500/20 border-green-500/30 border-[0.5px]';
    case 'expired':
      return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30 border-[0.5px]';
    case 'revoked':
      return 'text-red-500 bg-red-500/20 border-red-500/30 border-[0.5px]';
    default:
      return 'text-neutral-500 bg-neutral-500/20 border-neutral-500/30 border-[0.5px]';
  }
};
const BadgeStatus = ({ status }: { status: string }) => (
  <p className={`${getStatusStyle(status)} text-xs px-2 py-1 rounded`}>{status}</p>
);

const ShowAuthData = ({ authData }: { authData: AuthData }) => {
  const { type } = authData;
  const formatLicenseKey = (value: string) => (
    <div className="flex gap-2 ml-2">
      <HideShowText text={value} /> <CopyToClipboard textToCopy={value} />
    </div>
  );
  const formatStatus = (value: string) => <BadgeStatus status={value} />;
  const formatDeviceUniqueID = (value: string) => {
    if (value) {
      const firstPart = value.slice(0, 5);
      const lastPart = value.slice(-5);
      return (
        <div className="flex gap-2 ml-2">
          {`${firstPart}...${lastPart}`}
          <CopyToClipboard textToCopy={value} />
        </div>
      );
    }
    return '-';
  };
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'No activity';
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
    { key: 'name', label: 'Nama' },
    { key: 'whatsappNumber', label: 'Whatsapp' },
    // { key: 'isActive', label: 'Status', format: formatStatus },
  ];

  const nameField: FieldConfig = {
    key: 'name',
    label: 'Nama',
  };
  const licenseKeyField: FieldConfig = {
    key: 'key',
    label: 'License Key',
    format: formatLicenseKey,
  };
  const adminIdField: FieldConfig = { key: 'adminId', label: 'Admin ID' };
  const statusField: FieldConfig = { key: 'status', label: 'Status', format: formatStatus };
  const expiresAtField: FieldConfig = { key: 'expiresAt', label: 'Kedaluwarsa' };
  const generatedAtField: FieldConfig = {
    key: 'generatedAt',
    label: 'Tanggal Daftar',
    format: formatTime,
  };

  const licenseFields: FieldConfig[] = [
    nameField,
    licenseKeyField,
    adminIdField,
    statusField,
    expiresAtField,
    generatedAtField,
  ];

  const deviceNameField: FieldConfig = { key: 'deviceName', label: 'Nama Perangkat' };
  const platformField: FieldConfig = { key: 'platform', label: 'OS' };
  const architectureField: FieldConfig = { key: 'architecture', label: 'Architecture' };
  const cpuCoresField: FieldConfig = { key: 'cpuCores', label: 'CPU Cores' };
  const osVersionField: FieldConfig = { key: 'osVersion', label: 'OS Version' };
  const totalMemoryField: FieldConfig = { key: 'totalMemory', label: 'RAM' };
  const graphicsCardField: FieldConfig = { key: 'graphicsCard', label: 'Graphics Card' };
  const totalStorageField: FieldConfig = { key: 'totalStorage', label: 'Penyimpanan' };
  const deviceUniqueIDField: FieldConfig = {
    key: 'deviceUniqueID',
    label: 'Kode Unik Perangkat',
    format: formatDeviceUniqueID,
  };
  const deviceInfoFields: FieldConfig[] = [
    deviceNameField,
    platformField,
    architectureField,
    cpuCoresField,
    osVersionField,
    totalMemoryField,
    graphicsCardField,
    totalStorageField,
    deviceUniqueIDField,
  ];

  return (
    <div className="w-full max-w-screen-xl z-40">
      <div className="flex flex-col md:flex-row justify-center p-10 lg:p-0 items-start gap-10 z-40">
        {type === 'account' && authData.user && (
          <AccountInfo user={authData.user} fields={accountFields} />
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
      <div className="w-auto h-[125%] absolute -bottom-20 -left-[90%] lg:left-10 -z-10 opacity-70">
        <ADotted color="#1a1a1a" />
      </div>
    </div>
  );
};

export default ShowAuthData;
