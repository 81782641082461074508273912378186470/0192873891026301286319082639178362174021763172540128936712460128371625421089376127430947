import { NextRequest, NextResponse } from 'next/server';
import Activity from '@/models/Activity'; // Adjust path to your Activity model
import mongooseConnect from '@/lib/mongoose';

// Hypothetical function to get current user (replace with your auth logic)
async function getCurrentUser() {
  return { role: 'admin' }; // Placeholder; implement actual auth
}

// POST /api/activities - Create a new activity
export async function POST(request: NextRequest) {
  try {
    await mongooseConnect();

    const user = await getCurrentUser();
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { entityType, entityId, adminId, action, details } = body;

    if (!entityType || !entityId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newActivity = new Activity({
      entityType,
      entityId,
      adminId,
      action,
      details,
    });

    await newActivity.save();

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/activities - Retrieve activities with optional filters
export async function GET(request: NextRequest) {
  try {
    await mongooseConnect();

    const user = await getCurrentUser();
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const filters: Record<string, string> = {};

    if (searchParams.has('entityType')) filters.entityType = searchParams.get('entityType')!;
    if (searchParams.has('entityId')) filters.entityId = searchParams.get('entityId')!;
    if (searchParams.has('adminId')) filters.adminId = searchParams.get('adminId')!;
    if (searchParams.has('action')) filters.action = searchParams.get('action')!;

    const activities = await Activity.find(filters).sort({ timestamp: -1 });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
