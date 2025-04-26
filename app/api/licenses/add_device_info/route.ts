export const runtime = 'nodejs';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await mongooseConnect();

  try {
    const { key, deviceInfo } = await request.json();

    if (!key || !deviceInfo || !deviceInfo.deviceUniqueID) {
      console.error(
        'Validation error: License key and device information (including deviceUniqueID) are required'
      );
      return new Response(
        JSON.stringify({
          error: 'License key and device information (including deviceUniqueID) are required',
        }),
        { status: 400 }
      );
    }

    const license = await License.findOne({ key });

    if (!license) {
      return new Response(JSON.stringify({ error: 'License not found' }), { status: 404 });
    }

    if (license.deviceInfo) {
      if (license.deviceInfo.deviceUniqueID === deviceInfo.deviceUniqueID) {
        return NextResponse.json({
          message: 'Device already linked to this license',
          licenseDetails: license,
        });
      } else {
        const { deviceName, platform } = license.deviceInfo;
        return new Response(
          JSON.stringify({
            error: 'Unauthorized: License is already linked to a different device',
            existingDevice: { deviceName, platform },
          }),
          { status: 401 }
        );
      }
    } else {
      license.deviceInfo = deviceInfo;
      await license.save();
      return NextResponse.json({
        message: 'Device information added successfully',
        licenseDetails: license,
      });
    }
  } catch (error: any) {
    console.error('Error updating device information:', error.message || error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to update device information',
      }),
      { status: 500 }
    );
  }
}
