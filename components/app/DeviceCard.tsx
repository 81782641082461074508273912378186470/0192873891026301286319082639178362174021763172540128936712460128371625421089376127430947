import React from 'react';

import { Cpu } from 'lucide-react';
import { DeviceInfo, FieldConfig } from '@/types/auth';
import InfoCard from './InfoCard';
import CopyToClipboard from '../CopyToClipboard';

interface DeviceCardProps {
  deviceInfo: DeviceInfo;
  className?: string;
}

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

const DeviceCard: React.FC<DeviceCardProps> = ({ deviceInfo, className }) => {
  const deviceInfoFields: FieldConfig[] = [
    { key: 'deviceName', label: 'Nama Perangkat' },
    { key: 'platform', label: 'OS' },
    { key: 'architecture', label: 'Architecture' },
    { key: 'cpuCores', label: 'CPU Cores' },
    { key: 'osVersion', label: 'OS Version' },
    { key: 'totalMemory', label: 'RAM' },
    { key: 'graphicsCard', label: 'Graphics Card' },
    { key: 'totalStorage', label: 'Penyimpanan' },
    { key: 'deviceUniqueID', label: 'Kode Unik Perangkat', format: formatDeviceUniqueID },
  ];

  return (
    <InfoCard
      icon={<Cpu size={24} className="text-emerald-400" />}
      title="Informasi Perangkat"
      fields={deviceInfoFields}
      data={deviceInfo}
      className={className}
    />
  );
};

export default DeviceCard;
