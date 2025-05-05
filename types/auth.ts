/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserDetails {
  username: string;
  role: string;
  email: string;
  name: string;
  whatsappNumber: string;
  isActive: boolean;
}

export interface DeviceInfo {
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

export interface LicenseDetails {
  name: string;
  key: string;
  deviceInfo: DeviceInfo;
  status: string;
  expiresAt: null | string;
  generatedAt: string;
}

export interface AuthData {
  type: 'account' | 'license';
  role: string;
  licenseKey?: string;
  license?: LicenseDetails;
  user?: UserDetails;
}

export interface FieldConfig {
  key: string;
  label: string;
  format?: (value: any) => React.ReactNode;
}
