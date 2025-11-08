/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import { createQRISSubscriptionPayment } from '@/lib/PaymentUtils';
import { getUserFromRequest } from '@/lib/AuthUtils';
import Subscription from '@/models/Subscription';

/**
 * Renew a subscription
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
    const { subscriptionId, durationMonths = 1 } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // Find the subscription
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Check if user owns this subscription or is an admin
    if (
      subscription.userId.toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      return NextResponse.json(
        { error: 'Not authorized to renew this subscription' },
        { status: 403 }
      );
    }

    // Initiate QRIS payment for renewal
    const paymentResult = await createQRISSubscriptionPayment(
      subscription.plan,
      subscription.totalPrice,
      user.name,
      user.email,
      user._id.toString(), // customerNumber
      user.whatsappNumber || undefined,
      {
        userId: user._id.toString(),
        subscriptionId: subscription._id.toString(),
        durationMonths,
        isRenewal: true,
      }
    );

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.message || 'Failed to initiate payment for renewal' },
        { status: 400 }
      );
    }

    // Add payment to subscription history
    subscription.paymentHistory.push({
      transactionId: paymentResult.transactionId!,
      amount: subscription.totalPrice,
      currency: 'IDR',
      paymentMethod: 'shopeepay_qris',
      paymentGateway: 'faspay',
      status: 'pending',
      paidAt: new Date(),
    });

    await subscription.save();

    // Renew subscription (will be updated to active after payment confirmation)
    try {
      // We'll update the dates after payment confirmation via webhook
      // For now, just return the payment URL

      // Return success with QRIS payment URL
      return NextResponse.json({
        success: true,
        message: 'Subscription renewal initiated with QRIS payment',
        subscription: {
          id: subscription._id,
          plan: subscription.plan,
          status: subscription.status,
          totalPrice: subscription.totalPrice,
        },
        payment: {
          transactionId: paymentResult.transactionId,
          paymentUrl: paymentResult.paymentUrl,
          paymentMethod: 'shopeepay_qris',
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Failed to renew subscription' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error renewing subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
