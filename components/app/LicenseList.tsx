'use client';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthDashboardContext';
import HideShowText from '../HideShowText';
import CopyToClipboard from '../CopyToClipboard';
import { RiAddCircleLine } from 'react-icons/ri';
import { formatTime } from '@/lib/utils';

import { CgSandClock } from 'react-icons/cg';

const LicenseList: React.FC = () => {
  const { authDetails } = useAuth();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = authDetails.token;
    const fetchLicenses = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/license_list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch licenses');
        }
        const data = await response.json();
        setLicenses(data.licenses);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLicenses();
    } else {
      setError('Authentication token not found');
    }
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (licenses.length === 0) {
    return <div className="text-center p-4">No licenses found.</div>;
  }
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
  return (
    <div className="w-full p-5 max-w-[350px]">
      {licenses.length === 0 ? (
        <p className="text-neutral-400 tracking-widest font-light text-sm">No licenses found.</p>
      ) : (
        <div className="flex flex-col gap-5 bg-dark-800 max-h-[300px] overflow-y-auto __autolaku_scrollbar">
          {licenses.map((license: any, index: any) => (
            <div
              key={index}
              className="p-5 gap-2 flex flex-col rounded-lg bg-dark-700 border border-white/10">
              <div className="flex w-full justify-between items-start">
                <p className="flex gap-1 items-center font-semibold">
                  {license.name} <BadgeStatus status={license.status} />
                </p>{' '}
                <div className="flex items-center gap-2">
                  <HideShowText text={license.key} /> <CopyToClipboard textToCopy={license.key} />
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <RiAddCircleLine />
                Dibuat: {'  '} <strong>{formatTime(license.generatedAt)}</strong>
              </div>
              <div className="flex gap-1 items-center">
                <CgSandClock />
                Kedaluwarsa: {'  '} <strong>{formatTime(license.expiresAt)}</strong>
              </div>
              <div className="w-full flex justify-end"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LicenseList;
