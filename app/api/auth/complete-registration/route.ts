/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import bcrypt from 'bcrypt';

/**
 * Complete registration after successful payment
 * Validates the transactionId belongs to the user and is completed, then updates credentials.
 */
export async function POST(request: Request) {
  try {
    await mongooseConnect();

    const { userId, transactionId, username, password, whatsappNumber } = await request.json();

    if (!userId || !transactionId) {
      return NextResponse.json(
        { error: 'userId and transactionId are required' },
        { status: 400 }
      );
    }

    // Verify subscription/payment belongs to this user and is completed
    const subscription = await Subscription.findOne({
      userId,
      'paymentHistory.transactionId': transactionId,
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription or transaction not found' }, { status: 404 });
    }

    const payment = subscription.paymentHistory.find((p: any) => p.transactionId === transactionId);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.status !== 'completed') {
      return NextResponse.json(
        { error: 'Payment is not completed yet' },
        { status: 400 }
      );
    }

    // Load user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare updates
    const updates: any = {};

    if (typeof whatsappNumber === 'string' && whatsappNumber.trim() !== '') {
      updates.whatsappNumber = whatsappNumber.trim();
    }

    if (typeof username === 'string' && username.trim() !== '') {
      const normalized = username.trim().toLowerCase();
      const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
      if (!usernameRegex.test(username)) {
        return NextResponse.json(
          { error: 'Username must be at least 3 characters (letters, numbers, underscore only)' },
          { status: 400 }
        );
      }
      const exists = await User.findOne({
        _id: { $ne: userId },
        username: { $regex: `^${normalized}$`, $options: 'i' },
      });
      if (exists) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
      updates.username = normalized;
    }

    if (typeof password === 'string' && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Nothing to update. Provide username, password or whatsappNumber.' },
        { status: 400 }
      );
    }

    // Ensure user is active after completed payment
    updates.isActive = true;

    const updated = await User.findByIdAndUpdate(userId, updates, { new: true });

    return NextResponse.json({ success: true, user: {
      id: updated?._id,
      username: updated?.username,
      email: updated?.email,
      name: updated?.name,
      whatsappNumber: updated?.whatsappNumber,
      isActive: updated?.isActive,
    }});
  } catch (error: any) {
    console.error('Complete registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete registration' },
      { status: 500 }
    );
  }
}


