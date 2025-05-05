'use client';
import React from 'react';
import HideShowText from '../HideShowText';
import CopyToClipboard from '../CopyToClipboard';
import { formatTime } from '@/lib/utils';
import { RiAddCircleLine } from 'react-icons/ri';
import { CgSandClock } from 'react-icons/cg';

interface LicenseDetails {
  name: string;
  key: string;
  adminId: null | string;
  deviceInfo: {
    deviceName: string;
    platform: string;
    architecture: string;
    cpuCores: number;
    osVersion: string;
    totalMemory: string;
    graphicsCard: string;
    totalStorage: string;
    deviceUniqueID: string;
  };
  status: string;
  expiresAt: null | string;
  generatedAt: string;
}

interface LicenseListProps {
  licenses: LicenseDetails[];
}

const LicenseList: React.FC<LicenseListProps> = ({ licenses }) => {
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
    <p className={`${getStatusStyle(status)} text-xs px-1 py-0.5 rounded border-[1px] w-fit`}>
      {status}
    </p>
  );

  console.log('LICENSE LIST:', licenses);
  return (
    <div className="w-full p-5 max-w-[350px] bg-dark-500">
      {licenses.length === 0 ? (
        <p className="text-neutral-400 tracking-widest font-light text-sm">No licenses found.</p>
      ) : (
        <div className="flex flex-col gap-5 max-h-[300px] overflow-y-auto __autolaku_scrollbar">
          {licenses.map((license, index) => (
            <div key={index} className="p-5 gap-2 flex flex-col rounded-lg border border-white/10">
              <div className="flex w-full justify-between items-start">
                <p className="flex gap-1 items-center font-semibold">
                  {license.name} <BadgeStatus status={license.status} />
                </p>{' '}
                <div className="flex items-center gap-2">
                  <HideShowText text={license.key} /> <CopyToClipboard textToCopy={license.key} />
                </div>
              </div>
              <p className="flex gap-1 items-center">
                <RiAddCircleLine />
                Dibuat: {'  '} <strong>{formatTime(license.generatedAt)}</strong>
              </p>
              <p className="flex gap-1 items-center">
                <CgSandClock />
                Kedaluwarsa: {'  '} <strong>{formatTime(license.expiresAt)}</strong>
              </p>
              <div className="w-full flex justify-end"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LicenseList;
