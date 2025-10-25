/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import mongooseConnect from '@/lib/mongoose';
import User from '@/models/User';
import { hasActiveSubscription, getUserSubscription } from '@/lib/SubscriptionUtils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'perspicacity';

export async function POST(request: Request) {
  await mongooseConnect();

  const { username, password } = await request.json();
  const user = await User.findOne({
    username: { $regex: `^${username}$`, $options: 'i' },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
      });
    }
  } catch (error) {
    console.error('Error during password comparison:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }

  // Check if user has an active subscription (for admin/owner roles)
  let subscriptionData = null;
  let subscriptionStatus = { hasActiveSubscription: false, isExpired: false };

  if (user.role === 'admin' || user.role === 'owner') {
    // Get subscription data
    const subscription = await getUserSubscription(user._id);

    if (subscription) {
      subscriptionData = {
        id: subscription._id,
        plan: subscription.plan,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        licenseLimit: subscription.licenseLimit,
        autoRenew: subscription.autoRenew,
      };

      // Check if subscription is active
      const isActive = await hasActiveSubscription(user._id);
      subscriptionStatus = {
        hasActiveSubscription: isActive,
        isExpired:
          subscription.status === 'expired' ||
          (subscription.status === 'active' && subscription.endDate < new Date()),
      };
    }
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return new Response(
    JSON.stringify({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        name: user.name,
        whatsappNumber: user.whatsappNumber,
        licenseLimit: user.licenseLimit,
        subscription: user.subscription, // Legacy field
        subscriptionId: user.subscriptionId,
        subscriptionData,
        subscriptionStatus,
        isActive: user.isActive,
      },
    }),
    { status: 200 }
  );
}
