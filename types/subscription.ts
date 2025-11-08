import { Types } from 'mongoose';

export type SubscriptionPlan = 'starter' | 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type BillingCycle = 'monthly' | 'annual';

export interface PaymentHistory {
  _id?: Types.ObjectId;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentGateway: string;
  status: PaymentStatus;
  paidAt: Date;
  invoiceUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriptionAddOn {
  _id?: Types.ObjectId;
  key?: string;
  name?: string;
  cycle?: BillingCycle;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  price?: number; // legacy support
  active: boolean;
  startedAt?: Date;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface SubscriptionEntitlement {
  featureKey: string;
  enabled: boolean;
  limit: number | null;
  source: 'plan' | 'add_on';
  sourceKey: string;
}

export interface SubscriptionPricingSnapshot {
  basePrice: number;
  addOnTotal: number;
  discountAmount?: number;
  total: number;
  currency: string;
  catalogVersion?: number;
}

export interface CatalogPlan {
  _id: Types.ObjectId;
  slug: SubscriptionPlan | string;
  title: string;
  description?: string;
  licenseLimit: number;
  pricing: Array<{
    cycle: BillingCycle;
    price: number;
    currency: string;
    discountLabel?: string;
  }>;
  features: Array<{
    featureKey: string;
    limit?: number;
  }>;
  availableAddOnKeys: string[];
  status: 'active' | 'draft' | 'archived';
  version: number;
}

export interface CatalogAddOn {
  _id: Types.ObjectId;
  key: string;
  name: string;
  description?: string;
  pricing: Array<{
    cycle: BillingCycle | 'one_time';
  price: number;
    currency: string;
  }>;
  featureAdjustments: Array<{
    featureKey: string;
    enable?: boolean;
    limitDelta?: number;
  }>;
  constraints?: {
    allowedPlanSlugs?: string[];
    conflictingAddOnKeys?: string[];
  };
  status: 'active' | 'archived';
}

export interface Subscription {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  plan: SubscriptionPlan;
  planSlug?: string;
  planVersion?: number;
  billingCycle?: BillingCycle;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  licenseLimit: number;
  paymentHistory: PaymentHistory[];
  addOns: SubscriptionAddOn[];
  basePrice: number;
  totalPrice: number;
  pricingSnapshot?: SubscriptionPricingSnapshot;
  entitlements?: SubscriptionEntitlement[];
  notes?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionRequest {
  userId: string;
  plan: SubscriptionPlan;
  planSlug?: string;
  billingCycle?: BillingCycle;
  addOns?: Array<{
    key: string;
    quantity?: number;
    cycle?: BillingCycle;
  }>;
  autoRenew?: boolean;
}

export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  plan?: SubscriptionPlan | string;
  billingCycle?: BillingCycle;
  addOns?: Array<{
    key: string;
    quantity?: number;
    cycle?: BillingCycle;
    active?: boolean;
  }>;
  autoRenew?: boolean;
  status?: SubscriptionStatus;
  notes?: string;
  cancelReason?: string;
}

export interface SubscriptionResponse {
  subscription: Subscription;
  message: string;
}
