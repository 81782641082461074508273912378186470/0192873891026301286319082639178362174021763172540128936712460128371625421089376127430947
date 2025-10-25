/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import { createSubscription } from '@/lib/SubscriptionUtils';
import { createQRISSubscriptionPayment } from '@/lib/PaymentUtils';
import { getUserFromRequest } from '@/lib/AuthUtils';
import { SubscriptionPlan } from '@/types/subscription';

/**
 * Create a new subscription
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
    const { plan, durationMonths = 1, addOns = [], autoRenew = true } = await request.json();
    
    // Validate plan
    if (!plan || !['starter', 'basic', 'pro', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be one of: starter, basic, pro, enterprise' },
        { status: 400 }
      );
    }
    
    // Create subscription
    try {
      const subscription = await createSubscription(
        user._id,
        plan as SubscriptionPlan,
        durationMonths,
        addOns,
        autoRenew
      );
      
      // Initiate QRIS payment
      const paymentResult = await createQRISSubscriptionPayment(
        plan,
        subscription.totalPrice,
        user.name,
        user.email,
        user._id.toString(), // customerNumber
        user.whatsappNumber || undefined,
        {
          userId: user._id.toString(),
          subscriptionId: subscription._id.toString(),
          durationMonths,
        }
      );
      
      if (!paymentResult.success) {
        return NextResponse.json(
          { error: paymentResult.message || 'Failed to initiate payment' },
          { status: 400 }
        );
      }
      
      // Add payment to subscription history
      subscription.paymentHistory.push({
        transactionId: paymentResult.transactionId!,
        amount: subscription.totalPrice,
        currency: 'IDR',
        paymentMethod: 'qris_shopeepay',
        paymentGateway: 'faspay',
        status: 'pending',
        paidAt: new Date(),
      });
      
      await subscription.save();
      
      // Return success with QRIS payment URL
      return NextResponse.json({
        success: true,
        message: 'Subscription created and QRIS payment initiated',
        subscription: {
          id: subscription._id,
          plan: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          licenseLimit: subscription.licenseLimit,
          totalPrice: subscription.totalPrice,
        },
        payment: {
          transactionId: paymentResult.transactionId,
          paymentUrl: paymentResult.paymentUrl,
          paymentMethod: 'qris_shopeepay',
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Failed to create subscription' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
