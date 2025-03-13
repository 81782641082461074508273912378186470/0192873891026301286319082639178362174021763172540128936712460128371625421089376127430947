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

    if (!key || !deviceInfo) {
      console.error('Validation error: License key and device information are required');
      return new Response(
        JSON.stringify({
          error: 'License key and device information are required',
        }),
        { status: 400 }
      );
    }

    const license = await License.findOne({ key });

    if (!license) {
      return new Response(JSON.stringify({ error: 'License not found' }), {
        status: 404,
      });
    }

    license.deviceInfo = deviceInfo;
    await license.save();

    return NextResponse.json({
      message: 'Device information updated successfully',
      licenseDetails: license,
    });
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
