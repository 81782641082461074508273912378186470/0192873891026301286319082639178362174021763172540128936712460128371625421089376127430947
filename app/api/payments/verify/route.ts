/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { verifySubscriptionPayment } from '@/lib/PaymentUtils';
import mongooseConnect from '@/lib/mongoose';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/AuthUtils';

/**
 * Verify payment status
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
    const { transactionId } = await request.json();
    
    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }
    
    // Verify payment with the payment gateway
    const verificationResult = await verifySubscriptionPayment(transactionId);
    
    if (!verificationResult.success) {
      return NextResponse.json(
        { error: verificationResult.message },
        { status: 400 }
      );
    }
    
    // If payment is completed, update the subscription and user
    if (verificationResult.status === 'completed') {
      // Find subscription by transaction ID in payment history
      const subscription = await Subscription.findOne({
        'paymentHistory.transactionId': transactionId,
      });
      
      if (subscription) {
        // Update subscription status
        subscription.status = 'active';
        
        // Find and update the payment in history
        const paymentIndex = subscription.paymentHistory.findIndex(
          (p: any) => p.transactionId === transactionId
        );
        
        if (paymentIndex >= 0) {
          subscription.paymentHistory[paymentIndex].status = 'completed';
          if (verificationResult.paidAt) {
            subscription.paymentHistory[paymentIndex].paidAt = verificationResult.paidAt;
          }
        }
        
        await subscription.save();
        
        // Update user's license limit
        const subscriptionUser = await User.findById(subscription.userId);
        if (subscriptionUser) {
          subscriptionUser.licenseLimit = subscription.licenseLimit;
          await subscriptionUser.save();
        }
        
        return NextResponse.json({
          success: true,
          status: 'completed',
          message: 'Payment completed successfully',
          subscription: {
            id: subscription._id,
            plan: subscription.plan,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            licenseLimit: subscription.licenseLimit,
          },
        });
      }
    }
    
    // Return verification result
    return NextResponse.json({
      success: verificationResult.success,
      status: verificationResult.status,
      message: verificationResult.message,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
