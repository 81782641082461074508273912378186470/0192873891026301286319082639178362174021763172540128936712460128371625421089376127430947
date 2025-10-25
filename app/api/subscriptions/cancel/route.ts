/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import { cancelSubscription } from '@/lib/SubscriptionUtils';
import { getUserFromRequest } from '@/lib/AuthUtils';
import Subscription from '@/models/Subscription';

/**
 * Cancel a subscription
 */
export async function POST(request: NextRequest) {
  try {
    await mongooseConnect();
    
    // Authenticate the user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const { subscriptionId, reason } = await request.json();
    
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }
    
    // Find the subscription
    const subscription = await Subscription.findById(subscriptionId);
    
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    // Check if user owns this subscription or is an admin/owner
    if (subscription.userId.toString() !== user._id.toString() && 
        user.role !== 'admin' && user.role !== 'owner') {
      return NextResponse.json({ error: 'Not authorized to cancel this subscription' }, { status: 403 });
    }
    
    // Cancel subscription
    try {
      const cancelledSubscription = await cancelSubscription(
        subscriptionId,
        reason || 'User requested cancellation'
      );
      
      // Return success
      return NextResponse.json({
        success: true,
        message: 'Subscription cancelled successfully',
        subscription: {
          id: cancelledSubscription._id,
          plan: cancelledSubscription.plan,
          status: cancelledSubscription.status,
          cancelReason: cancelledSubscription.cancelReason,
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Failed to cancel subscription' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
