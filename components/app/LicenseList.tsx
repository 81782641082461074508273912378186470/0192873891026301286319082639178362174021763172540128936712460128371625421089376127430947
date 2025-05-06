'use client';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthDashboardContext';

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

  return (
    <div className="p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Key</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Expires At</th>
          </tr>
        </thead>
        <tbody>
          {licenses.map((license, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="border p-2">{license.name || 'N/A'}</td>
              <td className="border p-2">{license.key}</td>
              <td className="border p-2">{license.status}</td>
              <td className="border p-2">
                {license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LicenseList;
