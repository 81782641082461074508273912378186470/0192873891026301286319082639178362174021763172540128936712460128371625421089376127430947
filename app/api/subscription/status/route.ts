/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import User from '@/models/User';
import Subscription from '@/models/Subscription';

/**
 * Check subscription and user activation status
 * Used by the success page to poll for account activation
 */
export async function GET(request: NextRequest) {
  try {
    await mongooseConnect();
    
    // Get transaction ID from query parameters
    const url = new URL(request.url);
    const transactionId = url.searchParams.get('transactionId');
    
    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }
    
    // Find subscription by transaction ID
    const subscription = await Subscription.findOne({
      'paymentHistory.transactionId': transactionId
    });
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    // Get payment status from payment history
    const payment = subscription.paymentHistory.find(
      (p: any) => p.transactionId === transactionId
    );
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // Get user status
    const user = await User.findById(subscription.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return relevant status information
    // IMPORTANT: Never return sensitive data like password hash
    return NextResponse.json({
      success: true,
      status: {
        subscription: subscription.status,
        payment: payment.status,
        user: {
          isActive: user.isActive,
          username: user.username,
          email: user.email
        },
        plan: subscription.plan,
        licenseLimit: subscription.licenseLimit,
        transactionId: payment.transactionId
      }
    });
    
  } catch (error: any) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}
