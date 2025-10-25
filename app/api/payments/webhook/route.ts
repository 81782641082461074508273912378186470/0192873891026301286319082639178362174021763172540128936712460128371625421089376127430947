/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { paymentGateway } from '@/lib/PaymentUtils';
import mongooseConnect from '@/lib/mongoose';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { PaymentStatus } from '@/types/subscription';
import { FaspayWebhookData } from '@/types/payment';

/**
 * Handle webhook notifications from Faspay payment gateway
 */
export async function POST(request: NextRequest) {
  try {
    await mongooseConnect();
    
    // Parse the raw request body (Faspay sends data in request body, not headers)
    const rawData: FaspayWebhookData = await request.json();
    
    console.log('Received Faspay webhook:', {
      bill_no: rawData.bill_no,
      trx_id: rawData.trx_id,
      payment_status_code: rawData.payment_status_code,
      payment_channel: rawData.payment_channel,
    });
    
    // Validate the webhook signature
    const isValidSignature = paymentGateway.validateWebhookSignature(rawData);
    if (!isValidSignature) {
      console.error('Invalid Faspay webhook signature for bill_no:', rawData.bill_no);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Parse the webhook data
    const webhookData = paymentGateway.parseWebhookData(rawData);
    
    // Find subscription by transaction ID (bill_no)
    const subscription = await Subscription.findOne({
      'paymentHistory.transactionId': webhookData.transactionId,
    });
    
    if (!subscription) {
      console.error('Subscription not found for transaction:', webhookData.transactionId);
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    // Handle different payment statuses
    switch (webhookData.status) {
      case 'completed':
        await handlePaymentSuccess(webhookData, subscription);
        break;
      
      case 'failed':
        await handlePaymentFailure(webhookData, subscription);
        break;
      
      case 'pending':
        await handlePaymentPending(webhookData, subscription);
        break;
      
      default:
        console.log(`Unhandled payment status ${webhookData.status} for transaction ${webhookData.transactionId}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing Faspay webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful QRIS payment
 */
async function handlePaymentSuccess(
  webhookData: any,
  subscription: any
) {
  console.log('Processing successful payment for subscription:', subscription._id);
  
  // Find the payment in the history and update its status
  const paymentIndex = subscription.paymentHistory.findIndex(
    (p: any) => p.transactionId === webhookData.transactionId
  );
  
  if (paymentIndex >= 0) {
    // Update existing payment record
    subscription.paymentHistory[paymentIndex].status = 'completed' as PaymentStatus;
    subscription.paymentHistory[paymentIndex].faspayTrxId = webhookData.faspayTrxId;
    subscription.paymentHistory[paymentIndex].paymentChannelUid = webhookData.paymentChannelUid;
    subscription.paymentHistory[paymentIndex].paidAt = webhookData.paidAt;
  } else {
    // If payment not found, add it to the history
    subscription.paymentHistory.push({
      transactionId: webhookData.transactionId,
      faspayTrxId: webhookData.faspayTrxId,
      amount: webhookData.amount,
      currency: 'IDR',
      paymentMethod: webhookData.paymentMethod,
      paymentGateway: 'faspay',
      paymentChannelUid: webhookData.paymentChannelUid,
      status: 'completed' as PaymentStatus,
      paidAt: webhookData.paidAt,
    });
  }
  
  // Update subscription status to active
  subscription.status = 'active';
  
  await subscription.save();
  
  // Update the user's license limit and activate account if needed
  const user = await User.findById(subscription.userId);
  if (user) {
    // IMPORTANT: Activate user account if it was pending registration
    // This allows new users to login after successful payment
    if (!user.isActive) {
      user.isActive = true;
      console.log('✅ Activated user account after successful payment:', {
        userId: user._id,
        username: user.username,
        email: user.email,
      });
    }
    
    // Update license limit from subscription
    user.licenseLimit = subscription.licenseLimit;
    await user.save();
    
    console.log('Updated user:', {
      username: user.username,
      isActive: user.isActive,
      licenseLimit: user.licenseLimit,
    });
    
    // TODO: Send welcome email to new users
    // if (just activated) {
    //   await sendWelcomeEmail(user.email, user.name, user.username);
    // }
  } else {
    console.error('⚠️  User not found for subscription:', subscription._id);
  }
}

/**
 * Handle failed QRIS payment
 */
async function handlePaymentFailure(
  webhookData: any,
  subscription: any
) {
  console.log('Processing failed payment for subscription:', subscription._id);
  
  // Find the payment in the history and update its status
  const paymentIndex = subscription.paymentHistory.findIndex(
    (p: any) => p.transactionId === webhookData.transactionId
  );
  
  if (paymentIndex >= 0) {
    // Update existing payment record
    subscription.paymentHistory[paymentIndex].status = 'failed' as PaymentStatus;
    subscription.paymentHistory[paymentIndex].faspayTrxId = webhookData.faspayTrxId;
    subscription.paymentHistory[paymentIndex].paymentChannelUid = webhookData.paymentChannelUid;
  } else {
    // If payment not found, add it to the history
    subscription.paymentHistory.push({
      transactionId: webhookData.transactionId,
      faspayTrxId: webhookData.faspayTrxId,
      amount: webhookData.amount,
      currency: 'IDR',
      paymentMethod: webhookData.paymentMethod,
      paymentGateway: 'faspay',
      paymentChannelUid: webhookData.paymentChannelUid,
      status: 'failed' as PaymentStatus,
      paidAt: webhookData.paidAt,
    });
  }
  
  // Keep subscription status as pending for failed payments
  // Don't change to failed unless it's expired
  
  await subscription.save();
}

/**
 * Handle pending QRIS payment
 */
async function handlePaymentPending(
  webhookData: any,
  subscription: any
) {
  console.log('Processing pending payment for subscription:', subscription._id);
  
  // Find the payment in the history and update its status
  const paymentIndex = subscription.paymentHistory.findIndex(
    (p: any) => p.transactionId === webhookData.transactionId
  );
  
  if (paymentIndex >= 0) {
    // Update existing payment record
    subscription.paymentHistory[paymentIndex].status = 'pending' as PaymentStatus;
    subscription.paymentHistory[paymentIndex].faspayTrxId = webhookData.faspayTrxId;
    subscription.paymentHistory[paymentIndex].paymentChannelUid = webhookData.paymentChannelUid;
  }
  
  // Keep subscription status as pending
  await subscription.save();
}
