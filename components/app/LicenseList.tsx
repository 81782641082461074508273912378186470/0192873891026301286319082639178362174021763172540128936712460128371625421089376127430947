/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthDashboardContext';
import { formatTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Plus, AlertCircle, ShieldAlert, LogOut, Activity, Search, Upload, Download, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import HideShowText from '../HideShowText';
import CopyToClipboard from '../CopyToClipboard';

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

interface ActivityItem {
  _id: string;
  action: string;
  platform: string;
  timestamp: string;
  details: any;
}

interface License {
  key: string;
  name: string;
  status: 'active' | 'expired' | 'revoked';
  generatedAt: string;
  expiresAt: string;
  deviceInfo?: DeviceInfo;
  isOnline?: boolean;
  lastSeenAt?: string;
  connectionEstablishedAt?: string;
  recentActivities?: ActivityItem[];
  activityCount?: number;
  hasMoreActivities?: boolean;
}

export default function LicenseList() {
  const { authDetails } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [logoutLoading, setLogoutLoading] = useState<string | null>(null);
  const [loadMoreLoading, setLoadMoreLoading] = useState<string | null>(null);
  const [activitySkips, setActivitySkips] = useState<{ [key: string]: number }>({});

  // Centralized function to fetch licenses with activities
  const fetchLicenses = async (showLoading = false) => {
    const token = authDetails?.token;
    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    if (showLoading) setLoading(true);
    
    try {
      const response = await fetch('/api/license_list?include=activities&activityLimit=10', {
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
      setError(null);
      // Reset pagination state when fetching fresh data
      setActivitySkips({});
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Function to load more activities for a specific license
  const loadMoreActivities = async (licenseKey: string) => {
    const token = authDetails?.token;
    if (!token) return;

    setLoadMoreLoading(licenseKey);
    const currentSkip = activitySkips[licenseKey] || 0;
    const newSkip = currentSkip + 10;

    try {
      const response = await fetch(`/api/license_list?include=activities&activityLimit=10&activitySkip=${newSkip}&licenseKey=${licenseKey}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load more activities');
      }

      const data = await response.json();
      
      // Find the license in the response (should be the only one due to licenseKey filter)
      const updatedLicense = data.licenses.find((l: License) => l.key === licenseKey);
      
      if (updatedLicense) {
        // Update the licenses state by merging new activities
        setLicenses(prevLicenses => 
          prevLicenses.map(license => {
            if (license.key === licenseKey) {
              return {
                ...license,
                recentActivities: [
                  ...(license.recentActivities || []),
                  ...(updatedLicense.recentActivities || [])
                ],
                hasMoreActivities: updatedLicense.hasMoreActivities
              };
            }
            return license;
          })
        );
        
        // Update the skip count for this license
        setActivitySkips(prev => ({
          ...prev,
          [licenseKey]: newSkip
        }));
      }
    } catch (err: any) {
      console.error('Error loading more activities:', err.message);
    } finally {
      setLoadMoreLoading(null);
    }
  };

  useEffect(() => {
    fetchLicenses(true);
  }, [authDetails]);

  // Setup admin SSE connection for real-time license status updates
  useEffect(() => {
    const token = authDetails?.token;
    
    if (!token) return;

    let eventSource: EventSource | null = null;

    const connectToAdminStream = () => {
      try {
        eventSource = new EventSource('/api/admin/status-stream');

        eventSource.onopen = () => {
          console.log('Admin status stream connected');
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'status_change') {
              console.log(`License status update: ${data.licenseKey} - ${data.message}`);
              
              // Refresh all license data including activities when status changes
              fetchLicenses(false);
            }
          } catch (error) {
            console.error('Error parsing admin SSE message:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('Admin SSE connection error:', error);
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          
          // Retry connection after 10 seconds
          setTimeout(() => {
            if (authDetails?.token) {
              connectToAdminStream();
            }
          }, 10000);
        };
      } catch (error) {
        console.error('Failed to establish admin SSE connection:', error);
      }
    };

    connectToAdminStream();

    // Cleanup on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };
  }, [authDetails?.token]);

  const handleLogoutDevice = async (licenseKey: string) => {
    if (!confirm('Are you sure you want to logout this device? The user will be logged out immediately.')) {
      return;
    }

    setLogoutLoading(licenseKey);
    try {
      const token = authDetails?.token;
      const response = await fetch('/api/licenses/admin_logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ licenseKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to logout device');
      }

      const data = await response.json();
      
      // Refresh license data to get updated activities after logout
      fetchLicenses(false);

      alert(`Device "${data.loggedOutDevice.deviceName}" has been logged out successfully.`);
    } catch (err: unknown) {
      console.error('Error logging out device:', err);
      alert(`Failed to logout device: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLogoutLoading(null);
    }
  };

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

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'License_Login':
        return { icon: User, color: 'text-green-500' };
      case 'License_Logout':
        return { icon: User, color: 'text-red-500' };
      case 'Searching_Product_Start':
      case 'Searching_Product_Stop':
        return { icon: Search, color: 'text-blue-500' };
      case 'Scraping_Start':
      case 'Scraping_Stop':
        return { icon: Download, color: 'text-purple-500' };
      case 'Summarizing_Product':
        return { icon: Upload, color: 'text-orange-500' };
      default:
        return { icon: Activity, color: 'text-zinc-500' };
    }
  };

  const getActivityLabel = (action: string) => {
    switch (action) {
      case 'License_Login':
        return 'Logged in';
      case 'License_Logout':
        return 'Logged out';
      case 'Searching_Product_Start':
        return 'Started search';
      case 'Searching_Product_Stop':
        return 'Finished search';
      case 'Scraping_Start':
        return 'Started scraping';
      case 'Scraping_Stop':
        return 'Finished scraping';
      case 'Summarizing_Product':
        return 'Processing products';
      default:
        return action.replace(/_/g, ' ');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-5 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 bg-zinc-800 mb-2" />
            <Skeleton className="h-4 w-96 bg-zinc-800" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16 bg-zinc-800" />
            <Skeleton className="h-4 w-16 bg-zinc-800" />
            <Skeleton className="h-4 w-24 bg-zinc-800" />
          </div>
        </div>

        {/* License Cards Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/60 border-zinc-800/50 backdrop-blur-sm">
              <div className="h-1 bg-zinc-700 rounded-t-lg"></div>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 bg-zinc-800 mb-2" />
                    <Skeleton className="h-5 w-20 bg-zinc-800" />
                  </div>
                  <Skeleton className="h-6 w-12 bg-zinc-800" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full bg-zinc-800 rounded-lg" />
                <Skeleton className="h-20 w-full bg-zinc-800 rounded-lg" />
                <Skeleton className="h-24 w-full bg-zinc-800 rounded-lg" />
              </CardContent>
              <CardFooter className="bg-zinc-900/30 border-t border-zinc-800/50 pt-4">
                <div className="w-full grid grid-cols-2 gap-4">
                  <Skeleton className="h-8 w-full bg-zinc-800" />
                  <Skeleton className="h-8 w-full bg-zinc-800" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-5 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white">License Management</h2>
          <p className="text-zinc-400 text-sm mt-1">Monitor and manage your active licenses in real-time</p>
        </div>
        
        {/* Error Card */}
        <Card className="bg-gradient-to-br from-red-900/20 to-red-900/10 border-red-800/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-red-400">Error Loading Licenses</h3>
              <p className="text-zinc-300 max-w-md">{error}</p>
              <Button
                variant="outline"
                onClick={() => fetchLicenses(true)}
                className="mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50">
                <AlertCircle className="mr-2 h-4 w-4" />
                Retry Loading
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (licenses.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-5 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white">License Management</h2>
          <p className="text-zinc-400 text-sm mt-1">Monitor and manage your active licenses in real-time</p>
        </div>
        
        {/* Empty State Card */}
        <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/60 border-zinc-800/50 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="p-4 bg-zinc-800/50 rounded-full">
                <ShieldAlert className="h-10 w-10 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-white">No Licenses Found</h3>
                <p className="text-zinc-400 max-w-md">
                  You don&apos;t have any licenses yet. Create your first license to get started with the platform.
                </p>
              </div>
              <Button variant="outline" className="mt-6 border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                <Plus className="mr-2 h-4 w-4" />
                Create New License
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-5 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">License Management</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Monitor and manage your active licenses in real-time
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
            <span>Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Recent Activity</span>
          </div>
        </div>
      </div>

      {/* License Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {licenses.map((license, index) => {
          const { className, icon: StatusIcon } = getStatusConfig(license.status);
          const isOnline = license.isOnline && license.deviceInfo;
          const activityCount = license.recentActivities?.length || 0;
          const totalActivityCount = license.activityCount || 0;
          
          return (
            <Card
              key={index}
              className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-900/60 border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20">
              
              {/* Status Indicator Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg ${isOnline ? 'bg-green-500' : license.deviceInfo ? 'bg-yellow-500' : 'bg-gray-600'}`}></div>
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white text-lg">{license.name}</h3>
                      {isOnline && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                          <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs font-medium">LIVE</span>
                        </div>
                      )}
                    </div>
                    <Badge className={cn('font-medium cursor-default', className)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {license.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {/* Activity Count Badge */}
                  {totalActivityCount > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <Activity className="h-3 w-3 text-blue-400" />
                      <span className="text-blue-400 text-xs font-medium">{totalActivityCount}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* License Key Section */}
                <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-400 text-sm font-medium">License Key</span>
                    <div className="flex gap-2">
                      <HideShowText text={license.key} />
                      <CopyToClipboard textToCopy={license.key} />
                    </div>
                  </div>
                </div>
                
                {/* Device Info Section */}
                {license.deviceInfo ? (
                  <div className="bg-gradient-to-r from-zinc-800/40 to-zinc-800/20 rounded-lg p-4 border border-zinc-700/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                        <span className="text-white font-medium text-sm">
                          {isOnline ? 'Device Online' : 'Device Connected'}
                        </span>
                      </div>
                      {license.lastSeenAt && !isOnline && (
                        <div className="text-xs text-zinc-400 bg-zinc-900/50 px-2 py-1 rounded">
                          Last seen: {formatTime(license.lastSeenAt)}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300 font-medium">{license.deviceInfo.deviceName}</span>
                        <span className="text-xs text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded">
                          {license.deviceInfo.platform}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400">
                        {license.deviceInfo.architecture} • {license.deviceInfo.totalMemory}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLogoutDevice(license.key)}
                        disabled={logoutLoading === license.key}
                        className="text-xs h-8 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 transition-all">
                        {logoutLoading === license.key ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-400 mr-2"></div>
                            Logging out...
                          </>
                        ) : (
                          <>
                            <LogOut className="h-3 w-3 mr-2" />
                            Force Logout
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-800/20 rounded-lg p-4 border border-dashed border-zinc-700/50 text-center">
                    <div className="text-zinc-500 text-sm">
                      <User className="h-5 w-5 mx-auto mb-2 opacity-50" />
                      No device connected
                    </div>
                  </div>
                )}

                {/* Recent Activities Section */}
                {license.recentActivities && license.recentActivities.length > 0 ? (
                  <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-800/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-400" />
                        <span className="text-white font-medium text-sm">Recent Activity</span>
                      </div>
                      <div className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                        {activityCount} of {totalActivityCount}
                      </div>
                    </div>
                    
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {license.recentActivities.map((activity, idx) => {
                        const { icon: ActivityIcon, color } = getActivityIcon(activity.action);
                        return (
                          <div key={idx} className="flex items-center gap-3 py-2 px-3 bg-zinc-900/30 rounded-lg">
                            <ActivityIcon className={`h-4 w-4 ${color} flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <span className="text-zinc-200 text-sm font-medium">
                                {getActivityLabel(activity.action)}
                              </span>
                              <div className="text-xs text-zinc-400 mt-1">
                                {activity.platform} • {formatTime(activity.timestamp)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Load More Button */}
                    {license.hasMoreActivities && (
                      <div className="mt-3 pt-3 border-t border-zinc-700/30">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadMoreActivities(license.key)}
                          disabled={loadMoreLoading === license.key}
                          className="w-full text-xs h-8 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all">
                          {loadMoreLoading === license.key ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400 mr-2"></div>
                              Loading more...
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-2" />
                              Load More Activities
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-zinc-800/20 rounded-lg p-4 border border-dashed border-zinc-700/50 text-center">
                    <div className="text-zinc-500 text-sm">
                      <Activity className="h-5 w-5 mx-auto mb-2 opacity-50" />
                      No recent activity
                    </div>
                  </div>
                )}
              </CardContent>
              
              {/* Footer with License Info */}
              <CardFooter className="bg-zinc-900/30 border-t border-zinc-800/50 pt-4">
                <div className="w-full grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Plus className="h-3 w-3 text-zinc-500" />
                    <div>
                      <div className="text-zinc-500">Created</div>
                      <div className="text-zinc-300 font-medium">{formatTime(license.generatedAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    <div>
                      <div className="text-zinc-500">Expires</div>
                      <div className="text-zinc-300 font-medium">{formatTime(license.expiresAt)}</div>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
