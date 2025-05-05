export const runtime = 'nodejs';
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

  return key;
}

async function createUniqueLicense(name: string, email: string, whatsappNumber: string) {
  let key;
  let isUnique = false;

  while (!isUnique) {
    key = generateLicenseKey();
    const existingLicense = await License.findOne({ key: key });
    if (!existingLicense) {
      isUnique = true;
    }
  }

  const license = await License.create({
    name: name,
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

    const license = await createUniqueLicense(name, email, whatsappNumber);

    return NextResponse.json(
      {
        message: 'License created successfully',
        key: license.key,
        name: name,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating license:', error.message || error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create license' }), {
      status: 500,
    });
  }
}
