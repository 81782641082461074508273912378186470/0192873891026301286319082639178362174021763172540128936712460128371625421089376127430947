import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await mongooseConnect();

  try {
    const { key, deviceId } = await request.json();

    const license = await License.findOne({ key });

    if (!license) {
      return new Response(JSON.stringify({ error: 'License not found' }), {
        status: 404,
      });
    }

    if (license.status !== 'active') {
      return new Response(JSON.stringify({ error: 'License is not active' }), {
        status: 403,
      });
    }

    if (deviceId) {
      license.deviceInfo = {
        ...(license.deviceInfo || {}),
        deviceUniqueID: deviceId,
      }; // Bind the device info
      await license.save();
    }

    return NextResponse.json({
      message: 'License validated successfully',
      license: {
        _id: license._id,
        key: license.key,
        adminId: license.adminId,
        deviceInfo: license.deviceInfo,
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
