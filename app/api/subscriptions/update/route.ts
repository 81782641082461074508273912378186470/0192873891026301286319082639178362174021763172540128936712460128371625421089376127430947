/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import { updateSubscription } from '@/lib/SubscriptionUtils';
import { getUserFromRequest } from '@/lib/AuthUtils';
import Subscription from '@/models/Subscription';
import { SubscriptionPlan } from '@/types/subscription';

/**
 * Update an existing subscription
 */
export async function PATCH(request: NextRequest) {
  try {
    await mongooseConnect();
    
    // Authenticate the user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const { subscriptionId, plan, addOns, autoRenew, status, notes, cancelReason } = await request.json();
    
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
      return NextResponse.json({ error: 'Not authorized to update this subscription' }, { status: 403 });
    }
    
    // Validate plan if provided
    if (plan && !['starter', 'basic', 'pro', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be one of: starter, basic, pro, enterprise' },
        { status: 400 }
      );
    }
    
    // Update subscription
    try {
      const updatedSubscription = await updateSubscription(subscriptionId, {
        plan: plan as SubscriptionPlan | undefined,
        addOns,
        autoRenew,
        status: status as any,
        notes,
        cancelReason,
      });
      
      // Return success
      return NextResponse.json({
        success: true,
        message: 'Subscription updated successfully',
        subscription: {
          id: updatedSubscription._id,
          plan: updatedSubscription.plan,
          status: updatedSubscription.status,
          startDate: updatedSubscription.startDate,
          endDate: updatedSubscription.endDate,
          licenseLimit: updatedSubscription.licenseLimit,
          totalPrice: updatedSubscription.totalPrice,
          autoRenew: updatedSubscription.autoRenew,
          addOns: updatedSubscription.addOns,
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Failed to update subscription' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
