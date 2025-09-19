export const runtime = 'nodejs';

import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse, NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/AuthUtils';
import { licenseEvents } from '@/lib/LicenseEvents';

export async function POST(request: NextRequest) {
  try {
    // Establish database connection
    await mongooseConnect();

    // Authenticate user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Authorize user based on role
    if (user.role !== 'admin' && user.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    // Get license key from request body
    const { licenseKey } = await request.json();

    if (!licenseKey) {
      return NextResponse.json({ error: 'License key is required' }, { status: 400 });
    }

    // Find the license
    const license = await License.findOne({ key: licenseKey });

    if (!license) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    // Check if the license belongs to this admin
    if (license.adminId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden: This license does not belong to you' }, { status: 403 });
    }

    // Check if device is currently logged in
    if (!license.deviceInfo) {
      return NextResponse.json({ error: 'No device is currently logged in with this license' }, { status: 400 });
    }

    // Store device info for response before removing it
    const deviceInfo = license.deviceInfo;

    // Remove device info (logout the device)
    license.deviceInfo = null;
    await license.save();

    // Trigger real-time notification via SSE
    licenseEvents.emit(licenseKey, {
      type: 'logout',
      timestamp: new Date().toISOString(),
      message: 'Device has been logged out by admin',
      deviceInfo: {
        deviceName: deviceInfo.deviceName,
        platform: deviceInfo.platform,
        deviceUniqueID: deviceInfo.deviceUniqueID,
      },
    });

    return NextResponse.json({
      message: 'Device logged out successfully',
      license: {
        key: license.key,
        name: license.name,
        status: license.status,
      },
      loggedOutDevice: {
        deviceName: deviceInfo.deviceName,
        platform: deviceInfo.platform,
        deviceUniqueID: deviceInfo.deviceUniqueID,
      },
    });
  } catch (error: unknown) {
    console.error('Error in admin logout:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to logout device' }, { status: 500 });
  }
} 