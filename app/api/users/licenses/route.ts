/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';
import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse, NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/AuthUtils';

export async function GET(request: NextRequest) {
  await mongooseConnect();

  try {
    const user = await getUserFromRequest(request);
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const licenses = await License.find({ adminId: user._id }).exec();

    return NextResponse.json(
      {
        message: 'Licenses retrieved successfully',
        licenses,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching licenses:', error.message || error);
    return NextResponse.json({ error: 'Failed to fetch licenses' }, { status: 500 });
  }
}
