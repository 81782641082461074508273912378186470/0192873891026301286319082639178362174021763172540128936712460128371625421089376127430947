/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentStatus } from './subscription';

export interface FaspayConfig {
  merchantId: string;
  userId: string;
  password: string;
  environment: 'sandbox' | 'production';
  baseUrl: string;
}

export interface FaspayQRISPaymentRequest {
  merchant_id: string;
  bill_no: string;
  bill_date: string;
  bill_expired: string;
  bill_desc: string;
  bill_total: string;
  cust_no: string;
  cust_name: string;
  return_url: string;
  msisdn: string;
  email: string;
  payment_channel: string[];
  signature: string;
  item: Array<{
    product: string;
    qty: string;
    amount: string;
    payment_plan: string;
    merchant_id: string;
    tenor: string;
  }>;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerNumber: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  paymentUrl?: string;
  invoiceUrl?: string;
  status?: PaymentStatus;
  errorCode?: string;
}

export interface FaspayWebhookData {
  trx_id: string;
  merchant_id: string;
  merchant: string;
  bill_no: string;
  bill_reff: string;
  bill_date: string;
  bill_expired: string;
  bill_desc: string;
  bill_currency: string;
  bill_gross: string;
  bill_miscfee: string;
  bill_total: string;
  cust_no: string;
  cust_name: string;
  payment_channel: string;
  payment_channel_uid: string;
  payment_date: string;
  payment_status_code: string;
  payment_status_desc: string;
  signature: string;
}

export interface PaymentWebhookData {
  transactionId: string;
  faspayTrxId: string;
  status: PaymentStatus;
  amount: number;
  paymentMethod: string;
  paymentChannelUid: string;
  paidAt: Date;
  metadata?: Record<string, any>;
  rawData: any;
}

export interface PaymentVerificationRequest {
  transactionId: string;
  amount?: number;
}

export interface PaymentVerificationResponse {
  success: boolean;
  status: PaymentStatus;
  message: string;
  transactionId: string;
  amount?: number;
  paymentMethod?: string;
  paidAt?: Date;
}
