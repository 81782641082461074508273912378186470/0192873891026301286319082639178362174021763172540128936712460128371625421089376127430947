import { Types } from 'mongoose';

export type SubscriptionPlan = 'starter' | 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

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
  name: string;
  price: number;
  active: boolean;
}

export interface Subscription {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  licenseLimit: number;
  paymentHistory: PaymentHistory[];
  addOns: SubscriptionAddOn[];
  basePrice: number;
  totalPrice: number;
  notes?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionRequest {
  userId: string;
  plan: SubscriptionPlan;
  addOns?: Array<{
    name: string;
    price: number;
  }>;
  autoRenew?: boolean;
}

export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  plan?: SubscriptionPlan;
  addOns?: Array<{
    name: string;
    price: number;
    active: boolean;
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
