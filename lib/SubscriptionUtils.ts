/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import License from '@/models/License';
import { SubscriptionPlan } from '@/types/subscription';

/**
 * Get license limit for a given plan
 */
export function getLicenseLimitByPlan(plan: SubscriptionPlan): number {
  const limits: Record<SubscriptionPlan, number> = {
    starter: 5,
    basic: 10,
    pro: 20,
    enterprise: 50, // Default for enterprise, can be customized
  };
  return limits[plan] || 0;
}

/**
 * Get base price for a given plan (in IDR)
 */
export function getBasePriceByPlan(plan: SubscriptionPlan): number {
  const prices: Record<SubscriptionPlan, number> = {
    starter: 20000, // IDR 20k
    basic: 60000, // IDR 60k
    pro: 85000, // IDR 85k
    enterprise: 100000, // IDR 100k
  };
  return prices[plan] || 0;
}

/**
 * Calculate subscription duration in months
 */
export function calculateSubscriptionDuration(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate difference in months
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  return Math.max(1, months); // Minimum 1 month
}

/**
 * Calculate end date based on start date and duration in months
 */
export function calculateEndDate(startDate: Date, durationMonths: number): Date {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);
  return endDate;
}

/**
 * Create a new subscription
 */
export async function createSubscription(
  userId: string | Types.ObjectId,
  plan: SubscriptionPlan,
  durationMonths: number = 1,
  addOns: Array<{ name: string; price: number }> = [],
  autoRenew: boolean = true
): Promise<any> {
  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if user already has a subscription
  const existingSubscription = await Subscription.findOne({ userId });
  if (existingSubscription) {
    throw new Error('User already has an active subscription');
  }

  // Calculate dates
  const startDate = new Date();
  const endDate = calculateEndDate(startDate, durationMonths);

  // Get license limit and base price for the plan
  const licenseLimit = getLicenseLimitByPlan(plan);
  const basePrice = getBasePriceByPlan(plan);

  // Calculate total price including add-ons
  let totalPrice = basePrice;
  if (addOns && addOns.length > 0) {
    totalPrice += addOns.reduce((sum, addon) => sum + addon.price, 0);
  }

  // Create the subscription
  const subscription = new Subscription({
    userId,
    plan,
    status: 'pending', // Will be updated to 'active' after payment
    startDate,
    endDate,
    autoRenew,
    licenseLimit,
    basePrice,
    totalPrice,
    addOns: addOns.map((addon) => ({ ...addon, active: true })),
    paymentHistory: [], // Will be populated after payment
  });

  // Save the subscription
  await subscription.save();

  // Update user with subscription reference
  user.subscriptionId = subscription._id;
  await user.save();

  return subscription;
}

/**
 * Update an existing subscription
 */
export async function updateSubscription(
  subscriptionId: string | Types.ObjectId,
  updates: {
    plan?: SubscriptionPlan;
    addOns?: Array<{ name: string; price: number; active: boolean }>;
    autoRenew?: boolean;
    status?: 'active' | 'expired' | 'cancelled' | 'pending';
    notes?: string;
    cancelReason?: string;
  }
): Promise<any> {
  // Find the subscription
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new Error('Subscription not found');
  }

  // Update fields
  if (updates.plan && updates.plan !== subscription.plan) {
    subscription.plan = updates.plan;
    subscription.licenseLimit = getLicenseLimitByPlan(updates.plan);
    subscription.basePrice = getBasePriceByPlan(updates.plan);
  }

  if (updates.addOns) {
    subscription.addOns = updates.addOns;
  }

  if (typeof updates.autoRenew === 'boolean') {
    subscription.autoRenew = updates.autoRenew;
  }

  if (updates.status) {
    subscription.status = updates.status;
  }

  if (updates.notes) {
    subscription.notes = updates.notes;
  }

  if (updates.cancelReason) {
    subscription.cancelReason = updates.cancelReason;
  }

  // Recalculate total price
  let totalPrice = subscription.basePrice;
  if (subscription.addOns && subscription.addOns.length > 0) {
    totalPrice += subscription.addOns
      .filter((addon: { active: any }) => addon.active)
      .reduce((sum: any, addon: { price: any }) => sum + addon.price, 0);
  }
  subscription.totalPrice = totalPrice;

  // Save the subscription
  await subscription.save();

  // If plan changed, update user's license limit
  if (updates.plan) {
    const user = await User.findById(subscription.userId);
    if (user) {
      user.licenseLimit = subscription.licenseLimit;
      await user.save();
    }
  }

  return subscription;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string | Types.ObjectId,
  reason: string = 'User requested cancellation'
): Promise<any> {
  // Find the subscription
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new Error('Subscription not found');
  }

  // Update subscription status
  subscription.status = 'cancelled';
  subscription.cancelReason = reason;
  subscription.autoRenew = false;

  // Save the subscription
  await subscription.save();

  return subscription;
}

/**
 * Renew a subscription
 */
export async function renewSubscription(
  subscriptionId: string | Types.ObjectId,
  durationMonths: number = 1
): Promise<any> {
  // Find the subscription
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new Error('Subscription not found');
  }

  // Calculate new dates
  const startDate = new Date(); // Start from today
  const endDate = calculateEndDate(startDate, durationMonths);

  // Update subscription
  subscription.startDate = startDate;
  subscription.endDate = endDate;
  subscription.status = 'active';

  // Save the subscription
  await subscription.save();

  return subscription;
}

/**
 * Check if a subscription is active
 */
export async function isSubscriptionActive(
  subscriptionId: string | Types.ObjectId
): Promise<boolean> {
  // Find the subscription
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    return false;
  }

  // Check if subscription is active
  const now = new Date();
  return subscription.status === 'active' && subscription.endDate > now;
}

/**
 * Check if a user has an active subscription
 */
export async function hasActiveSubscription(userId: string | Types.ObjectId): Promise<boolean> {
  // Find the user's subscription
  const subscription = await Subscription.findOne({ userId });
  if (!subscription) {
    return false;
  }

  // Check if subscription is active
  const now = new Date();
  return subscription.status === 'active' && subscription.endDate > now;
}

/**
 * Get a user's subscription
 */
export async function getUserSubscription(userId: string | Types.ObjectId): Promise<any> {
  return Subscription.findOne({ userId });
}

/**
 * Check if a license is valid (active and not expired)
 */
export async function isLicenseValid(licenseId: string | Types.ObjectId): Promise<boolean> {
  // Find the license
  const license = await License.findById(licenseId);
  if (!license) {
    return false;
  }

  // Check if license is active
  if (license.status !== 'active') {
    return false;
  }

  // Check if license has expired
  const now = new Date();
  if (license.expiresAt && license.expiresAt < now) {
    return false;
  }

  // If license is linked to a subscription, check if subscription is active
  if (license.subscriptionId) {
    return isSubscriptionActive(license.subscriptionId);
  }

  return true;
}
