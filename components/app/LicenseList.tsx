/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthDashboardContext';
import { formatTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Plus, AlertCircle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import HideShowText from '../HideShowText';
import CopyToClipboard from '../CopyToClipboard';

interface License {
  key: string;
  name: string;
  status: 'active' | 'expired' | 'revoked';
  generatedAt: string;
  expiresAt: string;
}

export default function LicenseList() {
  const { authDetails } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = authDetails?.token;

    const fetchLicenses = async () => {
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
      setLoading(false);
    }
  }, [authDetails]);

  const getStatusConfig = (status: License['status']) => {
    switch (status) {
      case 'active':
        return {
          variant: 'success' as const,
          icon: ShieldAlert,
          className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20',
        };
      case 'expired':
        return {
          variant: 'warning' as const,
          icon: Clock,
          className: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20',
        };
      case 'revoked':
        return {
          variant: 'destructive' as const,
          icon: AlertCircle,
          className: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20',
        };
      default:
        return {
          variant: 'secondary' as const,
          icon: AlertCircle,
          className: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20',
        };
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full bg-black/40 border-zinc-800 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-1/3 bg-zinc-800" />
                <Skeleton className="h-5 w-1/4 bg-zinc-800" />
              </div>
            </CardHeader>
            <CardContent className="pb-2 space-y-3">
              <Skeleton className="h-4 w-full bg-zinc-800" />
              <Skeleton className="h-4 w-2/3 bg-zinc-800" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/2 bg-zinc-800" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto p-6 bg-black/40 border-red-900/50 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h3 className="text-xl font-medium text-red-500">Error Loading Licenses</h3>
          <p className="text-zinc-400">{error}</p>
          <Button
            variant="outline"
            className="mt-4 border-red-500/20 text-red-500 hover:bg-red-500/10">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (licenses.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto p-6 bg-black/40 border-zinc-800 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="rounded-full bg-zinc-900 p-3">
            <ShieldAlert className="h-8 w-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-medium text-zinc-300">No Licenses Found</h3>
          <p className="text-zinc-400">You don&apos;t have any licenses yet.</p>
          <Button variant="outline" className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Create New License
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      <div className="grid gap-5 md:grid-cols-2">
        {licenses.map((license, index) => {
          const { className, icon: StatusIcon } = getStatusConfig(license.status);
          return (
            <Card
              key={index}
              className="w-full bg-black/40 border-zinc-800 backdrop-blur-sm hover:bg-dark-700 transition-all duration-200">
              <CardHeader className="">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-zinc-200">{license.name}</div>
                  <Badge className={cn('font-normal cursor-default', className)}>
                    <StatusIcon className="h-3 w-3" />
                    {license.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-center gap-2 p-2 group">
                  <div className="flex gap-1">
                    <HideShowText text={license.key} />
                    <CopyToClipboard textToCopy={license.key} />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 p-2 group">
                  {' '}
                  <div className="flex items-center gap-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Created:</span>
                    <span className="text-zinc-300 font-medium">
                      {formatTime(license.generatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Expires:</span>
                    <span className="text-zinc-300 font-medium">
                      {formatTime(license.expiresAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
              {/* <CardFooter className="pt-0">
                <div className="w-full flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
                    Manage
                  </Button>
                </div>
              </CardFooter> */}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
