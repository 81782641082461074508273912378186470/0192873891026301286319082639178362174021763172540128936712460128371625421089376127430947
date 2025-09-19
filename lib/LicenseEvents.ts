// Types for license events
export interface LicenseEvent {
  type: 'connected' | 'ping' | 'logout' | 'status_change' | 'online' | 'offline';
  licenseKey?: string;
  timestamp: string;
  message?: string;
  deviceInfo?: {
    deviceName: string;
    platform: string;
    deviceUniqueID: string;
  };
}

// Simple in-memory event emitter for license events
export class LicenseEventEmitter {
  private listeners: Map<string, Set<(data: LicenseEvent) => void>> = new Map();

  subscribe(licenseKey: string, callback: (data: LicenseEvent) => void) {
    if (!this.listeners.has(licenseKey)) {
      this.listeners.set(licenseKey, new Set());
    }
    this.listeners.get(licenseKey)!.add(callback);
  }

  unsubscribe(licenseKey: string, callback: (data: LicenseEvent) => void) {
    const listeners = this.listeners.get(licenseKey);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(licenseKey);
      }
    }
  }

  emit(licenseKey: string, data: LicenseEvent) {
    const listeners = this.listeners.get(licenseKey);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  getConnectionCount(): number {
    return Array.from(this.listeners.values()).reduce((total, set) => total + set.size, 0);
  }
}

// Global event emitter instance
export const licenseEvents = new LicenseEventEmitter(); 