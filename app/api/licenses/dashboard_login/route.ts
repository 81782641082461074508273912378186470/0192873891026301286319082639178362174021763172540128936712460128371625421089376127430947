/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { isLicenseValid } from '@/lib/SubscriptionUtils';
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

    // Check if license is active
    if (license.status !== 'active') {
      return new Response(JSON.stringify({ error: 'License is not active' }), {
        status: 403,
      });
    }

    // Check if license has expired
    const now = new Date();
    if (license.expiresAt && license.expiresAt < now) {
      // Update license status to expired
      license.status = 'expired';
      await license.save();

      return new Response(JSON.stringify({ error: 'License has expired' }), {
        status: 403,
      });
    }

    // If license is linked to a subscription, check if subscription is active
    if (license.subscriptionId) {
      const isValid = await isLicenseValid(license._id);
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: 'License is not valid due to subscription issues' }),
          {
            status: 403,
          }
        );
      }
    }

    if (deviceId) {
      license.deviceInfo = {
        ...(license.deviceInfo || {}),
        deviceUniqueID: deviceId,
      };
      await license.save();
    }

    return NextResponse.json({
      message: 'License validated successfully',
      license: {
        _id: license._id,
        key: license.key,
        name: license.name,
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
    return new Response(JSON.stringify({ error: error || 'Something went wrong' }), {
      status: 500,
    });
  }
}
