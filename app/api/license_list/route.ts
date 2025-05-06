/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';
import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse, NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/AuthUtils';

export async function GET(request: NextRequest) {
  try {
    // Establish database connection
    await mongooseConnect();

    // Authenticate user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Authorize user based on role
    if (user.role !== 'admin' && user.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    // Retrieve licenses for the authenticated user
    const licenses = await License.find({ adminId: user._id }).exec();

    // Return success response
    return NextResponse.json(
      {
        message: 'Licenses retrieved successfully',
        licenses,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching licenses:', error.message || error);

    // Handle specific error cases
    if (error.message === 'Authentication failed') {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Generic server error
    return NextResponse.json({ error: 'Failed to fetch licenses' }, { status: 500 });
  }
}
