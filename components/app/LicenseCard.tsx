import React from 'react';

import InfoCard from './InfoCard';
import { Key } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { FieldConfig, LicenseDetails } from '@/types/auth';
import CopyToClipboard from '../CopyToClipboard';
import HideShowText from '../HideShowText';

interface LicenseCardProps {
  license: LicenseDetails;
  className?: string;
}

const formatLicenseKey = (value: string) => (
  <div className="flex items-center gap-2">
    <HideShowText text={value} /> <CopyToClipboard textToCopy={value} />
  </div>
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
const formatStatus = (value: string) => <BadgeStatus status={value} />;
const LicenseCard: React.FC<LicenseCardProps> = ({ license, className }) => {
  const licenseFields: FieldConfig[] = [
    { key: 'name', label: 'Nama' },
    { key: 'key', label: 'License Key', format: formatLicenseKey },
    { key: 'status', label: 'Status', format: formatStatus },
    { key: 'expiresAt', label: 'Kedaluwarsa', format: (value) => formatTime(value) },
    { key: 'generatedAt', label: 'Tanggal Daftar', format: (value) => formatTime(value) },
  ];

  return (
    <InfoCard
      icon={<Key size={24} className="text-indigo-400" />}
      title="License Details"
      fields={licenseFields}
      data={license}
      className={className}
    />
  );
};

export default LicenseCard;
