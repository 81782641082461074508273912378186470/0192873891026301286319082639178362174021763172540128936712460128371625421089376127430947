import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import mongooseConnect from '@/lib/mongoose';
import Activity from '@/models/Activity';

const createActivitySchema = z.object({
  userId: z.string().optional(),
  licenseId: z.string().optional(),
  action: z.enum([
    'Account_Login',
    'Account_Logout',
    'License_Login',
    'License_Logout',
    'Scraping_Start',
    'Scraping_Stop',
    'Searching_Product_Start',
    'Searching_Product_Stop',
    'Summarizing_Product',
  ]),
  platform: z.enum(['Website', 'App']),
  details: z.record(z.any()).optional(),
  sessionId: z.string().optional(),
});

const updateActivitySchema = z.object({
  details: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    await mongooseConnect();
    const body = await req.json();
    const validatedData = createActivitySchema.parse(body);

    const activity = new Activity({
      userId: validatedData.userId || null,
      licenseId: validatedData.licenseId || null,
      action: validatedData.action,
      platform: validatedData.platform,
      details: validatedData.details || {},
      sessionId: validatedData.sessionId || null,
    });

    await activity.save();
    return NextResponse.json(
      { message: 'Activity created successfully', activity },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await mongooseConnect();
    const body = await req.json();
    const { id } = body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid activity ID' }, { status: 400 });
    }

    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Activity deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await mongooseConnect();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid activity ID' }, { status: 400 });
    }

    const validatedData = updateActivitySchema.parse(updateData);

    const activity = await Activity.findByIdAndUpdate(id, validatedData, { new: true });
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Activity updated successfully', activity },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
