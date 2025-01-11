/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  await mongooseConnect();

  try {
    const { name, email, whatsappNumber, deviceName } = await request.json();

    // Validation
    if (!name || !email) {
      console.error('Validation error: Name and Email are required');
      return new Response(
        JSON.stringify({ error: 'Name and Email are required' }),
        { status: 400 }
      );
    }

    // Debugging logs
 //console.log('Incoming registration data:', {
      name,
      email,
      whatsappNumber,
      deviceName,
    });

    // Generate the license
    const license = await License.create({
      key: uuidv4(), // Unique license key
      adminId: null, // Default adminId
      deviceId: null, // Default deviceId
      deviceName: deviceName || null, // Device name or default to null
      status: 'active', // Default status
      expiresAt: null, // Default expiration date
    });

 //console.log('License created successfully:', license);

    // Return all license details
    return NextResponse.json({
      message: 'License created successfully',
      licenseDetails: license, // Include the full license object
    });
  } catch (error: any) {
    console.error('Error creating license:', error.message || error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create license' }),
      { status: 500 }
    );
  }
}
