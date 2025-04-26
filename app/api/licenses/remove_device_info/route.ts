/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  await mongooseConnect();

  try {
    const { key } = await request.json();

    if (!key) {
      console.error('Validation error: License key is required');
      return new Response(
        JSON.stringify({
          error: 'License key is required',
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

    license.deviceInfo = null;
    await license.save();

    return NextResponse.json({
      message: 'Device information removed successfully',
      licenseDetails: license,
    });
  } catch (error: any) {
    console.error('Error removing device information:', error.message || error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to remove device information',
      }),
      { status: 500 }
    );
  }
}
