/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import { createSubscription } from '@/lib/SubscriptionUtils';
import { createQRISSubscriptionPayment } from '@/lib/PaymentUtils';
import bcrypt from 'bcrypt';
import { SubscriptionPlan } from '@/types/subscription';

/**
 * Register new admin account with subscription payment requirement
 * This endpoint handles the complete registration flow:
 * 1. Creates pending user account (inactive)
 * 2. Creates pending subscription
 * 3. Initiates Faspay QRIS payment
 * 4. Returns payment URL for user to complete payment
 * 
 * User account is activated by webhook after successful payment
 */
export async function POST(request: Request) {
  try {
    await mongooseConnect();

    // Extract registration data
    const { name, email, whatsappNumber, username, password, plan } = await request.json();

    // Validate required fields
    if (!name || !email || !username || !password || !plan) {
      return NextResponse.json(
        { error: 'All fields are required: name, email, username, password, plan' },
        { status: 400 }
      );
    }

    // Validate plan
    const validPlans: SubscriptionPlan[] = ['starter', 'basic', 'pro', 'enterprise'];
    if (!validPlans.includes(plan as SubscriptionPlan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be one of: starter, basic, pro, enterprise' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate username (alphanumeric, underscore, minimum 3 characters)
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters (letters, numbers, underscore only)' },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await User.findOne({
      username: { $regex: `^${username}$`, $options: 'i' },
    });
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({
      email: { $regex: `^${email}$`, $options: 'i' },
    });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create PENDING user account (inactive until payment confirmed)
    const newUser = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      name,
      email: email.toLowerCase(),
      whatsappNumber: whatsappNumber || null,
      isActive: false, // CRITICAL: User cannot login until payment confirmed
      licenseLimit: 0, // Will be set after payment confirmation
      adminId: null,
      deviceId: null,
    });

    console.log('Created pending user account:', {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isActive: newUser.isActive,
    });

    try {
      // Create PENDING subscription
      const subscription = await createSubscription(
        newUser._id,
        plan as SubscriptionPlan,
        1, // 1 month duration
        [], // No add-ons for now
        true // Auto-renew enabled by default
      );

      console.log('Created pending subscription:', {
        id: subscription._id,
        plan: subscription.plan,
        status: subscription.status,
        licenseLimit: subscription.licenseLimit,
        totalPrice: subscription.totalPrice,
      });

      // Link subscription to user
      newUser.subscriptionId = subscription._id;
      await newUser.save();

      // Initiate QRIS payment via Faspay
      const paymentResult = await createQRISSubscriptionPayment(
        plan,
        subscription.totalPrice,
        newUser.name,
        newUser.email,
        newUser._id.toString(), // Customer number
        newUser.whatsappNumber || undefined,
        {
          userId: newUser._id.toString(),
          subscriptionId: subscription._id.toString(),
          isNewRegistration: true, // Flag for webhook to activate user
          plan: plan,
        }
      );

      if (!paymentResult.success) {
        // Payment initiation failed - rollback user and subscription
        console.error('Payment initiation failed, rolling back:', paymentResult.message);
        await User.findByIdAndDelete(newUser._id);
        await Subscription.findByIdAndDelete(subscription._id);

        return NextResponse.json(
          {
            error:
              paymentResult.message ||
              'Failed to initiate payment. Please try again or contact support.',
            errorCode: paymentResult.errorCode,
          },
          { status: 500 }
        );
      }

      console.log('Payment initiated successfully:', {
        transactionId: paymentResult.transactionId,
        paymentUrl: paymentResult.paymentUrl,
      });

      // Add payment to subscription history with pending status
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

      // Return payment information (DO NOT return password or sensitive data)
      return NextResponse.json(
        {
          success: true,
          message: 'Registration initiated. Please complete payment to activate your account.',
          payment: {
            transactionId: paymentResult.transactionId,
            paymentUrl: paymentResult.paymentUrl,
            amount: subscription.totalPrice,
            currency: 'IDR',
            plan: subscription.plan,
            licenseLimit: subscription.licenseLimit,
          },
          user: {
            username: newUser.username,
            email: newUser.email,
            name: newUser.name,
          },
          // NOTE: No JWT token returned - user must login after payment confirmation
        },
        { status: 201 }
      );
    } catch (error: any) {
      // Error during subscription/payment creation - rollback user
      console.error('Error during subscription/payment creation:', error);
      await User.findByIdAndDelete(newUser._id);

      return NextResponse.json(
        {
          error: error.message || 'Failed to process registration. Please try again.',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred during registration.',
      },
      { status: 500 }
    );
  }
}

