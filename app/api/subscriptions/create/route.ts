/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import { createSubscription } from '@/lib/SubscriptionUtils';
import { createQRISSubscriptionPayment } from '@/lib/PaymentUtils';
import { getUserFromRequest } from '@/lib/AuthUtils';
import { BillingCycle } from '@/types/subscription';

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
    const {
      plan: legacyPlan,
      planSlug,
      durationMonths = 1,
      billingCycle,
      addOns = [],
      addOnKeys = [],
      autoRenew = true,
    } = await request.json();

    const requestedPlan = planSlug || legacyPlan;
    if (!requestedPlan) {
      return NextResponse.json({ error: 'Plan is required' }, { status: 400 });
    }

    if (
      legacyPlan &&
      !['starter', 'basic', 'pro', 'enterprise'].includes(legacyPlan) &&
      !planSlug
    ) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be one of: starter, basic, pro, enterprise' },
        { status: 400 }
      );
    }

    const normalizedBillingCycle: BillingCycle | undefined =
      billingCycle && ['monthly', 'annual'].includes(billingCycle)
        ? (billingCycle as BillingCycle)
        : undefined;

    const normalizedAddOns = Array.isArray(addOns) ? addOns : [];

    const selectionsFromKeys = Array.isArray(addOnKeys)
      ? addOnKeys.map((key: string) => ({ key }))
      : [];

    const mergedAddOns = [...normalizedAddOns, ...selectionsFromKeys];

    // Create subscription
    try {
      const subscription = await createSubscription(
        user._id,
        requestedPlan,
        durationMonths,
        mergedAddOns,
        autoRenew,
        normalizedBillingCycle
      );

      // Initiate QRIS payment
      const paymentResult = await createQRISSubscriptionPayment(
        subscription.planSlug || subscription.plan,
        subscription.totalPrice,
        user.name,
        user.email,
        user._id.toString(), // customerNumber
        user.whatsappNumber || undefined,
        {
          userId: user._id.toString(),
          subscriptionId: subscription._id.toString(),
          durationMonths:
            subscription.billingCycle === 'annual'
              ? 12
              : subscription.billingCycle === 'monthly'
              ? 1
              : durationMonths,
          billingCycle: subscription.billingCycle,
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
        amount: subscription.pricingSnapshot?.total ?? subscription.totalPrice,
        currency: subscription.pricingSnapshot?.currency || 'IDR',
        paymentMethod: 'shopeepay_qris',
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
          planSlug: subscription.planSlug,
          billingCycle: subscription.billingCycle,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          licenseLimit: subscription.licenseLimit,
          totalPrice: subscription.totalPrice,
          pricingSnapshot: subscription.pricingSnapshot,
          entitlements: subscription.entitlements,
        },
        payment: {
          transactionId: paymentResult.transactionId,
          paymentUrl: paymentResult.paymentUrl,
          paymentMethod: 'shopeepay_qris',
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
