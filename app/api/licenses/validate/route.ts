import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await mongooseConnect();

  try {
    const { key, deviceId } = await request.json();

    // Find the license by key
    const license = await License.findOne({ key });

    // If license is not found
    if (!license) {
      return new Response(JSON.stringify({ error: 'License not found' }), {
        status: 404,
      });
    }

    // If the license is not active
    if (license.status !== 'active') {
      return new Response(JSON.stringify({ error: 'License is not active' }), {
        status: 403,
      });
    }

    // If the license is valid, tie it to the device and save
    if (deviceId) {
      license.deviceId = deviceId; // Bind the license to this device
      await license.save();
    }

    // Return full license details
    return NextResponse.json({
      message: 'License validated successfully',
      license: {
        _id: license._id,
        key: license.key,
        adminId: license.adminId,
        deviceId: license.deviceId,
        deviceName: license.deviceName,
        status: license.status,
        expiresAt: license.expiresAt,
        generatedAt: license.generatedAt,
        __v: license.__v,
      },
    });
  } catch (error) {
    console.error('Error validating license:', error);
    return new Response(
      JSON.stringify({ error: error || 'Something went wrong' }),
      {
        status: 500,
      }
    );
  }
}
