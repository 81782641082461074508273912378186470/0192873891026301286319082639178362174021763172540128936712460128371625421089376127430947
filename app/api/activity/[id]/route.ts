import { NextRequest, NextResponse } from 'next/server';
import Activity from '@/models/Activity'; // Adjust path to your Activity model
import mongooseConnect from '@/lib/mongoose';

async function getCurrentUser() {
  return { role: 'admin' };
}

// GET /api/activities/[id] - Retrieve a single activity
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await mongooseConnect();

    const user = await getCurrentUser();
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const activity = await Activity.findById(params.id);
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/activities/[id] - Update an activity
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await mongooseConnect();

    const user = await getCurrentUser();
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { action, details } = body;

    const activity = await Activity.findById(params.id);
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    if (action) activity.action = action;
    if (details) activity.details = details;

    await activity.save();

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/activities/[id] - Delete an activity
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await mongooseConnect();

    const user = await getCurrentUser();
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const activity = await Activity.findByIdAndDelete(params.id);
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Activity deleted' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
