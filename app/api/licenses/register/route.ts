/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  await mongooseConnect();

  try {
    const { name, email, whatsappNumber } = await request.json();

    if (!name || !email) {
      console.error('Validation error: Name and Email are required');
      return new Response(
        JSON.stringify({ error: 'Name and Email are required' }),
        { status: 400 }
      );
    }

    console.log('Incoming registration data:', {
      name,
      email,
      whatsappNumber,
    });

    const license = await License.create({
      key: uuidv4(),
      adminId: null,
      deviceInfo: null,
      status: 'active',
      expiresAt: null,
    });

    return NextResponse.json({
      message: 'License created successfully',
      licenseDetails: license,
    });
  } catch (error: any) {
    console.error('Error creating license:', error.message || error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create license' }),
      { status: 500 }
    );
  }
}
