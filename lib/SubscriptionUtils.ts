/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import License from '@/models/License';
import PlanCatalog from '@/models/PlanCatalog';
import AddOnCatalog from '@/models/AddOnCatalog';
import {
  BillingCycle,
  SubscriptionPlan,
  SubscriptionAddOn,
  SubscriptionEntitlement,
  SubscriptionPricingSnapshot,
} from '@/types/subscription';

type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

interface AddOnSelectionInput {
  key: string;
  quantity?: number;
  cycle?: BillingCycle;
}

interface BuildSubscriptionStateOptions {
  planSlug: string;
  billingCycle: BillingCycle;
  addOns: AddOnSelectionInput[];
}

interface BuildSubscriptionStateResult {
  planSlug: string;
  planVersion: number;
  licenseLimit: number;
  basePrice: number;
  pricingSnapshot: SubscriptionPricingSnapshot;
  entitlements: SubscriptionEntitlement[];
  addOns: SubscriptionAddOn[];
}

const BILLING_CYCLE_MONTHS: Record<BillingCycle, number> = {
  monthly: 1,
  annual: 12,
};

function normalizePlanSlug(plan: string): string {
  return plan.trim().toLowerCase();
}

function castSubscriptionPlan(planSlug: string): SubscriptionPlan {
  if (['starter', 'basic', 'pro', 'enterprise'].includes(planSlug)) {
    return planSlug as SubscriptionPlan;
  }
  // Default custom plans to enterprise tier for backward compatibility in legacy enums
  return 'enterprise';
}

function toBillingCycle(durationMonths?: number, explicit?: BillingCycle): BillingCycle {
  if (explicit) {
    return explicit;
  }
  if (durationMonths === 12) {
    return 'annual';
  }
  return 'monthly';
}

function calculateEndDate(startDate: Date, billingCycle: BillingCycle): Date {
  const durationMonths = BILLING_CYCLE_MONTHS[billingCycle] ?? 1;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);
  return endDate;
}

function applyFeatureAdjustment(
  entitlementsMap: Map<string, SubscriptionEntitlement>,
  featureKey: string,
  adjustment: { enable?: boolean; limitDelta?: number },
  sourceKey: string
) {
  const existing = entitlementsMap.get(featureKey) ?? {
    featureKey,
    enabled: false,
    limit: null,
    source: 'add_on' as const,
    sourceKey,
  };

  if (typeof adjustment.enable === 'boolean') {
    existing.enabled = adjustment.enable;
  } else if (!entitlementsMap.has(featureKey)) {
    existing.enabled = true;
  }

  if (typeof adjustment.limitDelta === 'number') {
    const currentLimit = existing.limit ?? 0;
    existing.limit = currentLimit + adjustment.limitDelta;
  }

  existing.source = 'add_on';
  existing.sourceKey = sourceKey;

  entitlementsMap.set(featureKey, existing);
}

async function buildSubscriptionState({
  planSlug,
  billingCycle,
  addOns,
}: BuildSubscriptionStateOptions): Promise<BuildSubscriptionStateResult> {
  const normalizedPlanSlug = normalizePlanSlug(planSlug);
  const plan = await PlanCatalog.findOne({ slug: normalizedPlanSlug, status: 'active' });

  if (!plan) {
    throw new Error(`Plan '${planSlug}' is not available`);
  }

  const planPricing = plan.pricing.find((price: { cycle: string }) => price.cycle === billingCycle);
  if (!planPricing) {
    throw new Error(`Plan '${plan.slug}' does not support ${billingCycle} billing`);
  }

  const entitlementsMap = new Map<string, SubscriptionEntitlement>();
  plan.features.forEach((feature: { featureKey: string; limit: number | null }) => {
    entitlementsMap.set(feature.featureKey, {
      featureKey: feature.featureKey,
      enabled: true,
      limit: typeof feature.limit === 'number' ? feature.limit : null,
      source: 'plan',
      sourceKey: plan.slug,
    });
  });

  const resolvedAddOns: SubscriptionAddOn[] = [];
  let addOnTotal = 0;

  if (addOns && addOns.length > 0) {
    const selectedKeys = new Set<string>();

    for (const selection of addOns) {
      if (!selection?.key) {
        continue;
      }

      const addOn = await AddOnCatalog.findOne({ key: selection.key, status: 'active' });
      if (!addOn) {
        throw new Error(`Add-on '${selection.key}' is not available`);
      }

      if (selectedKeys.has(addOn.key)) {
        throw new Error(`Duplicate add-on '${addOn.key}' in selection`);
      }

      if (
        addOn.constraints?.allowedPlanSlugs &&
        addOn.constraints.allowedPlanSlugs.length > 0 &&
        !addOn.constraints.allowedPlanSlugs.includes(plan.slug)
      ) {
        throw new Error(`Add-on '${addOn.key}' is not compatible with plan '${plan.slug}'`);
      }

      if (addOn.constraints?.conflictingAddOnKeys) {
        for (const conflicting of addOn.constraints.conflictingAddOnKeys) {
          if (selectedKeys.has(conflicting)) {
            throw new Error(
              `Add-on '${addOn.key}' conflicts with already selected add-on '${conflicting}'`
            );
          }
        }
      }

      selectedKeys.add(addOn.key);

      const preferredCycle = selection.cycle ?? billingCycle;
      let pricing = addOn.pricing.find(
        (price: { cycle: string }) => price.cycle === preferredCycle
      );
      if (!pricing) {
        pricing = addOn.pricing.find((price: { cycle: string }) => price.cycle === billingCycle);
      }
      if (!pricing) {
        pricing = addOn.pricing.find((price: { cycle: string }) => price.cycle === 'monthly');
      }
      if (!pricing) {
        throw new Error(`Add-on '${addOn.key}' does not have pricing for the selected cycle`);
      }

      const quantity = selection.quantity && selection.quantity > 0 ? selection.quantity : 1;
      const totalPrice = pricing.price * quantity;
      addOnTotal += totalPrice;

      resolvedAddOns.push({
        key: addOn.key,
        name: addOn.name,
        cycle: (pricing.cycle === 'one_time' ? billingCycle : pricing.cycle) as BillingCycle,
        quantity,
        unitPrice: pricing.price,
        totalPrice,
        active: true,
        metadata: addOn.metadata ?? undefined,
      });

      addOn.featureAdjustments.forEach(
        (adjustment: {
          featureKey?: any;
          enable?: boolean | undefined;
          limitDelta?: number | undefined;
        }) => {
          applyFeatureAdjustment(entitlementsMap, adjustment.featureKey, adjustment, addOn.key);
        }
      );
    }
  }

  const pricingSnapshot: SubscriptionPricingSnapshot = {
    basePrice: planPricing.price,
    addOnTotal,
    discountAmount: 0,
    total: planPricing.price + addOnTotal,
    currency: planPricing.currency || 'IDR',
    catalogVersion: plan.version,
  };

  return {
    planSlug: plan.slug,
    planVersion: plan.version,
    licenseLimit: plan.licenseLimit,
    basePrice: planPricing.price,
    pricingSnapshot,
    entitlements: Array.from(entitlementsMap.values()),
    addOns: resolvedAddOns,
  };
}

/**
 * Create a new subscription
 */
export async function createSubscription(
  userId: string | Types.ObjectId,
  plan: SubscriptionPlan | string,
  durationMonths: number = 1,
  addOns: Array<{ key?: string; quantity?: number; cycle?: BillingCycle }> = [],
  autoRenew: boolean = true,
  billingCycle?: BillingCycle
): Promise<any> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const existingSubscription = await Subscription.findOne({ userId });
  if (existingSubscription) {
    throw new Error('User already has an active subscription');
  }

  const resolvedBillingCycle = toBillingCycle(durationMonths, billingCycle);
  const addOnSelections = addOns
    .filter((addon) => addon && addon.key)
    .map((addon) => ({
      key: addon.key as string,
      quantity: addon.quantity,
      cycle: addon.cycle,
    }));

  const state = await buildSubscriptionState({
    planSlug: plan,
    billingCycle: resolvedBillingCycle,
    addOns: addOnSelections,
  });

  const startDate = new Date();
  const endDate = calculateEndDate(startDate, resolvedBillingCycle);

  const subscription = new Subscription({
    userId,
    plan: castSubscriptionPlan(state.planSlug),
    planSlug: state.planSlug,
    planVersion: state.planVersion,
    billingCycle: resolvedBillingCycle,
    status: 'pending',
    startDate,
    endDate,
    autoRenew,
    licenseLimit: state.licenseLimit,
    basePrice: state.basePrice,
    totalPrice: state.pricingSnapshot.total,
    pricingSnapshot: state.pricingSnapshot,
    addOns: state.addOns,
    entitlements: state.entitlements,
    paymentHistory: [],
  });

  await subscription.save();

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
    plan?: SubscriptionPlan | string;
    addOns?: Array<{ key: string; quantity?: number; cycle?: BillingCycle; active?: boolean }>;
    autoRenew?: boolean;
    status?: SubscriptionStatus;
    notes?: string;
    cancelReason?: string;
    billingCycle?: BillingCycle;
  }
): Promise<any> {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new Error('Subscription not found');
  }

  const nextPlanSlug = updates.plan
    ? normalizePlanSlug(updates.plan)
    : subscription.planSlug || subscription.plan;
  const nextBillingCycle = updates.billingCycle || subscription.billingCycle || 'monthly';

  const addOnSelections = (updates.addOns || subscription.addOns || [])
    .filter((addon: any) => addon && (addon.key || addon.name))
    .map((addon: any) => ({
      key: addon.key || addon.name,
      quantity: addon.quantity,
      cycle: addon.cycle || nextBillingCycle,
    }));

  const state = await buildSubscriptionState({
    planSlug: nextPlanSlug,
    billingCycle: nextBillingCycle,
    addOns: addOnSelections,
  });

  subscription.plan = castSubscriptionPlan(state.planSlug);
  subscription.planSlug = state.planSlug;
  subscription.planVersion = state.planVersion;
  subscription.billingCycle = nextBillingCycle;
  subscription.licenseLimit = state.licenseLimit;
  subscription.basePrice = state.basePrice;
  subscription.totalPrice = state.pricingSnapshot.total;
  subscription.pricingSnapshot = state.pricingSnapshot;
  subscription.addOns = state.addOns;
  subscription.entitlements = state.entitlements;

  if (typeof updates.autoRenew === 'boolean') {
    subscription.autoRenew = updates.autoRenew;
  }

  if (updates.status) {
    subscription.status = updates.status;
  }

  if (updates.notes !== undefined) {
    subscription.notes = updates.notes;
  }

  if (updates.cancelReason !== undefined) {
    subscription.cancelReason = updates.cancelReason;
  }

  await subscription.save();

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
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new Error('Subscription not found');
  }

  subscription.status = 'cancelled';
  subscription.cancelReason = reason;
  subscription.autoRenew = false;

  await subscription.save();

  return subscription;
}

/**
 * Renew a subscription
 */
export async function renewSubscription(
  subscriptionId: string | Types.ObjectId,
  billingCycle?: BillingCycle
): Promise<any> {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new Error('Subscription not found');
  }

  const resolvedCycle = billingCycle || subscription.billingCycle || 'monthly';
  const state = await buildSubscriptionState({
    planSlug: subscription.planSlug || subscription.plan,
    billingCycle: resolvedCycle,
    addOns: (subscription.addOns || [])
      .filter((addon: any) => addon && addon.key)
      .map((addon: any) => ({
        key: addon.key,
        quantity: addon.quantity,
        cycle: addon.cycle || resolvedCycle,
      })),
  });

  const startDate = new Date();
  const endDate = calculateEndDate(startDate, resolvedCycle);

  subscription.startDate = startDate;
  subscription.endDate = endDate;
  subscription.status = 'active';
  subscription.billingCycle = resolvedCycle;
  subscription.planVersion = state.planVersion;
  subscription.licenseLimit = state.licenseLimit;
  subscription.basePrice = state.basePrice;
  subscription.totalPrice = state.pricingSnapshot.total;
  subscription.pricingSnapshot = state.pricingSnapshot;
  subscription.entitlements = state.entitlements;

  await subscription.save();

  return subscription;
}

/**
 * Check if a subscription is active
 */
export async function isSubscriptionActive(
  subscriptionId: string | Types.ObjectId
): Promise<boolean> {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    return false;
  }

  const now = new Date();
  return subscription.status === 'active' && subscription.endDate > now;
}

/**
 * Check if a user has an active subscription
 */
export async function hasActiveSubscription(userId: string | Types.ObjectId): Promise<boolean> {
  const subscription = await Subscription.findOne({ userId });
  if (!subscription) {
    return false;
  }

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
  const license = await License.findById(licenseId);
  if (!license) {
    return false;
  }

  if (license.status !== 'active') {
    return false;
  }

  const now = new Date();
  if (license.expiresAt && license.expiresAt < now) {
    return false;
  }

  if (license.subscriptionId) {
    return isSubscriptionActive(license.subscriptionId);
  }

  return true;
}
