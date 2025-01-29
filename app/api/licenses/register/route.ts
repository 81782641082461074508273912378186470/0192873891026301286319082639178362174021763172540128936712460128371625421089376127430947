/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

function generateLicenseKey() {
  const segmentLength = 4;
  const segments = 4;
  let key = '';

  for (let i = 0; i < segments; i++) {
    const segment = randomBytes(segmentLength)
      .toString('hex')
      .slice(0, segmentLength)
      .toUpperCase();
    key += segment;
    if (i < segments - 1) {
      key += '-';
    }
  }

  return key; // Added return statement here
}

async function createUniqueLicense(email: string, whatsappNumber: string) {
  let key;
  let isUnique = false;

  while (!isUnique) {
    key = generateLicenseKey();
    // Check if the key already exists in the database
    const existingLicense = await License.findOne({ key: key });
    if (!existingLicense) {
      isUnique = true;
    }
  }

  // Create the license with the unique key
  const license = await License.create({
    key: key,
    adminId: null,
    deviceInfo: null,
    status: 'active',
    email: email,
    whatsappNumber: whatsappNumber,
    expiresAt: null,
  });

  return license;
}

export async function POST(request: Request) {
  await mongooseConnect();

  try {
    const { name, email, whatsappNumber } = await request.json();

    if (!name || !email) {
      console.error('Validation error: Name and Email are required');
      return new Response(JSON.stringify({ error: 'Name and Email are required' }), {
        status: 400,
      });
    }

    console.log('Incoming registration data:', {
      name,
      email,
      whatsappNumber,
    });

    const license = await createUniqueLicense(email, whatsappNumber);

    return NextResponse.json({
      message: 'License created successfully',
      licenseDetails: license,
    });
  } catch (error: any) {
    console.error('Error creating license:', error.message || error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create license' }), {
      status: 500,
    });
  }
}
