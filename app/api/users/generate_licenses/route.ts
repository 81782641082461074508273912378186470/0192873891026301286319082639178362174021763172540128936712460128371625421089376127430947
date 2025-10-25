/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';
import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse, NextRequest } from 'next/server';
import { randomBytes } from 'crypto';
import { getUserFromRequest } from '@/lib/AuthUtils';
import { hasActiveSubscription, getUserSubscription } from '@/lib/SubscriptionUtils';

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

export async function POST(request: NextRequest) {
  await mongooseConnect();

  try {
    const user = await getUserFromRequest(request);
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has an active subscription
    const hasSubscription = await hasActiveSubscription(user._id);
    if (!hasSubscription) {
      return NextResponse.json(
        { error: 'You need an active subscription to generate licenses' },
        { status: 403 }
      );
    }

    const requestData = await request.json();
    const { name, whatsappNumber, email } = requestData;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const licenseCount = await License.countDocuments({ adminId: user._id });
    if (user.licenseLimit > 0 && licenseCount >= user.licenseLimit) {
      return NextResponse.json(
        { error: 'You have reached your license generation limit' },
        { status: 403 }
      );
    }

    let key;
    let isUnique = false;
    while (!isUnique) {
      key = generateLicenseKey();
      const existingLicense = await License.findOne({ key });
      if (!existingLicense) {
        isUnique = true;
      }
    }

    // Get user's subscription for expiry date and subscription ID
    const subscription = await getUserSubscription(user._id);

    const license = await License.create({
      name,
      key,
      adminId: user._id,
      subscriptionId: subscription?._id || null,
      deviceInfo: null,
      status: 'active',
      email: email || null,
      whatsappNumber: whatsappNumber || null,
      expiresAt: subscription?.endDate || user.subscription?.expireDate || null,
    });

    return NextResponse.json(
      {
        message: 'License generated successfully',
        key: license.key,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    console.error('Error in route.ts generating license:', error.message || error);
    return NextResponse.json({ error: 'Failed to generate license' }, { status: 500 });
  }
}
