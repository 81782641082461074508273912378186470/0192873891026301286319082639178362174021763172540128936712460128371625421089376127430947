/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import crypto from 'crypto';
import {
  CreatePaymentRequest,
  FaspayConfig,
  FaspayQRISPaymentRequest,
  FaspayWebhookData,
  PaymentResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
  PaymentWebhookData,
} from '@/types/payment';

// Default configuration for Faspay sandbox environment
const DEFAULT_CONFIG: FaspayConfig = {
  merchantId: process.env.FASPAY_MERCHANT_ID || '36480',
  userId: process.env.FASPAY_USER_ID || 'bot36480',
  password: process.env.FASPAY_PASSWORD || 'p@ssw0rd',
  environment: process.env.FASPAY_ENVIRONMENT === 'production' ? 'production' : 'sandbox',
  baseUrl: process.env.FASPAY_BASE_URL || 'https://xpress-sandbox.faspay.co.id',
};

/**
 * FaspayPaymentGateway class for handling Faspay QRIS payment integration
 */
export class FaspayPaymentGateway {
  private config: FaspayConfig;
  private baseUrl: string;

  constructor(config: Partial<FaspayConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.baseUrl = this.config.baseUrl;
  }

  /**
   * Generate signature for Faspay Xpress v4 payment requests
   * Formula: SHA1(MD5(user_id + password + bill_no + bill_total))
   * Reference: https://docs.faspay.co.id/merchant-integration/api-reference-1/xpress/xpress-version-4
   */
  private generateSignature(bill_no: string, bill_total: string): string {
    const signatureString = this.config.userId + this.config.password + bill_no + bill_total;
    const md5Hash = crypto.createHash('md5').update(signatureString).digest('hex');
    const sha1Hash = crypto.createHash('sha1').update(md5Hash).digest('hex');
    return sha1Hash;
  }

  /**
   * Generate signature for Faspay webhook validation
   * Formula: SHA1(MD5(user_id + password + bill_no + payment_status_code))
   * Reference: https://docs.faspay.co.id/merchant-integration/api-reference-1/debit-transaction/payment-notification
   */
  private generateWebhookSignature(bill_no: string, payment_status_code: string): string {
    const signatureString =
      this.config.userId + this.config.password + bill_no + payment_status_code;
    const md5Hash = crypto.createHash('md5').update(signatureString).digest('hex');
    const sha1Hash = crypto.createHash('sha1').update(md5Hash).digest('hex');

    console.log('🔐 Webhook signature validation:', {
      formula: 'SHA1(MD5(user_id + password + bill_no + payment_status_code))',
      user_id: this.config.userId,
      bill_no: bill_no,
      payment_status_code: payment_status_code,
      calculated_signature: sha1Hash,
    });

    return sha1Hash;
  }

  /**
   * Generate unique bill number for transactions
   */
  private generateBillNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `AUTOLAKU-${timestamp}-${random}`;
  }

  /**
   * Format date for Faspay API (YYYY-MM-DD HH:mm:ss)
   */
  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  /**
   * Create a new QRIS payment transaction via Faspay
   * @param request Payment request data
   * @returns Payment response with redirect URL to QRIS page
   */
  async createQRISPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      // Generate unique bill number
      const bill_no = this.generateBillNo();

      // Calculate dates
      const now = new Date();
      const expired = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

      // Generate signature with bill_no and bill_total
      const bill_total = request.amount.toString();
      const signature = this.generateSignature(bill_no, bill_total);

      console.log('🔐 Signature generation:', {
        formula: 'SHA1(MD5(user_id + password + bill_no + bill_total))',
        user_id: this.config.userId,
        bill_no: bill_no,
        bill_total: bill_total,
        signature: signature,
      });

      // Format request for Faspay Xpress API
      const payload: FaspayQRISPaymentRequest = {
        merchant_id: this.config.merchantId,
        bill_no: bill_no,
        bill_date: this.formatDate(now),
        bill_expired: this.formatDate(expired),
        bill_desc: request.description,
        bill_total: request.amount.toString(),
        cust_no: request.customerNumber,
        cust_name: request.customerName,
        return_url: request.successRedirectUrl,
        msisdn: request.customerPhone || '',
        email: request.customerEmail,
        payment_channel: ['711'], // 711 = ShopeePay QRIS (official Faspay code)
        signature: signature,
        item: [
          {
            product: request.description, // Subscription plan description
            qty: '1',
            amount: request.amount.toString(),
            payment_plan: '01', // 01 = Full Payment (not installment)
            merchant_id: this.config.merchantId,
            tenor: '00', // 00 = No installment
          },
        ],
      };

      // Log the request payload for debugging
      console.log('🚀 Sending Faspay payment request:', {
        endpoint: `${this.baseUrl}/v4/post`,
        bill_no: payload.bill_no,
        bill_total: payload.bill_total,
        merchant_id: payload.merchant_id,
        payment_channel: payload.payment_channel,
        item: payload.item,
      });

      // Call Faspay Xpress API
      const response = await axios.post(`${this.baseUrl}/v4/post`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = response.data as any;

      console.log('✅ Faspay response received:', {
        response_code: responseData.response_code,
        response_desc: responseData.response_desc,
        redirect_url: responseData.redirect_url ? 'URL provided' : 'No URL',
      });

      // Check if request was successful
      if (responseData.response_code === '00') {
        return {
          success: true,
          message: 'QRIS payment initiated successfully',
          transactionId: bill_no,
          paymentUrl: responseData.redirect_url,
          status: 'pending',
        };
      } else {
        return {
          success: false,
          message: responseData.response_desc || 'Failed to create QRIS payment',
          errorCode: responseData.response_code,
        };
      }
    } catch (error: any) {
      // Enhanced error logging
      console.error('❌ Faspay API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        dataType: typeof error.response?.data,
        isHTML:
          typeof error.response?.data === 'string' && error.response?.data.includes('<!DOCTYPE'),
      });

      // If Faspay returns HTML (like 500 error page), log differently
      if (typeof error.response?.data === 'string' && error.response?.data.includes('<!DOCTYPE')) {
        console.error('⚠️  Faspay returned HTML error page (likely 500 Database Error)');
        console.error('This is a Faspay sandbox infrastructure issue, not a code problem.');
        return {
          success: false,
          message:
            'Faspay sandbox is currently experiencing issues. Please try again later or contact Faspay support.',
          errorCode: 'FASPAY_500',
        };
      }

      console.error('Raw error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.response_desc || 'Failed to create QRIS payment',
        errorCode: error.response?.data?.response_code || '500',
      };
    }
  }

  /**
   * Verify payment status (Note: Faspay doesn't have direct verification API)
   * Payment status is received through webhook notifications only
   * @param request Payment verification request
   * @returns Payment verification response
   */
  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    // Faspay doesn't provide a direct verification API endpoint
    // Payment status updates are only received through webhook notifications
    // This method is kept for compatibility but will always return pending status

    console.warn(
      'Faspay verification: Payment status can only be verified through webhook notifications'
    );

    return {
      success: true,
      status: 'pending',
      message: 'Payment verification not available. Status updates received via webhook only.',
      transactionId: request.transactionId,
    };
  }

  /**
   * Parse webhook notification from Faspay
   * @param rawData Raw webhook data from Faspay
   * @returns Parsed payment webhook data
   */
  parseWebhookData(rawData: FaspayWebhookData): PaymentWebhookData {
    // Map Faspay status codes to our status
    let status: 'pending' | 'completed' | 'failed' | 'refunded' = 'pending';

    switch (rawData.payment_status_code) {
      case '2':
        status = 'completed';
        break;
      case '3':
        status = 'failed';
        break;
      case '5':
        status = 'failed'; // Expired
        break;
      case '7':
        status = 'pending';
        break;
      default:
        status = 'pending';
    }

    return {
      transactionId: rawData.bill_no,
      faspayTrxId: rawData.trx_id,
      status,
      amount: parseFloat(rawData.bill_total),
      paymentMethod: rawData.payment_channel,
      paymentChannelUid: rawData.payment_channel_uid,
      paidAt: rawData.payment_date ? new Date(rawData.payment_date) : new Date(),
      metadata: {},
      rawData,
    };
  }

  /**
   * Validate webhook notification signature from Faspay
   * @param rawData Raw webhook data from Faspay
   * @returns Whether signature is valid
   */
  validateWebhookSignature(rawData: FaspayWebhookData): boolean {
    try {
      // Generate expected signature using WEBHOOK formula (different from payment request!)
      // Formula: SHA1(MD5(user_id + password + bill_no + payment_status_code))
      // Reference: https://docs.faspay.co.id/merchant-integration/api-reference-1/debit-transaction/payment-notification
      const expectedSignature = this.generateWebhookSignature(
        rawData.bill_no,
        rawData.payment_status_code
      );

      console.log('🔍 Signature comparison:', {
        received: rawData.signature,
        expected: expectedSignature,
        match: expectedSignature === rawData.signature,
      });

      // Compare with received signature
      return expectedSignature === rawData.signature;
    } catch (error) {
      console.error('Error validating webhook signature:', error);
      return false;
    }
  }
}

// Export a singleton instance with default configuration
export const paymentGateway = new FaspayPaymentGateway();

// Helper functions for QRIS payment operations
export async function createQRISSubscriptionPayment(
  plan: string,
  amount: number,
  customerName: string,
  customerEmail: string,
  customerNumber: string,
  customerPhone?: string,
  metadata?: Record<string, any>
): Promise<PaymentResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://autolaku.com';

  return paymentGateway.createQRISPayment({
    amount,
    currency: 'IDR',
    description: `Autolaku ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
    customerName,
    customerEmail,
    customerNumber,
    customerPhone,
    successRedirectUrl: `${baseUrl}/subscription/success`,
    failureRedirectUrl: `${baseUrl}/subscription/failure`,
    metadata: {
      plan,
      ...metadata,
    },
  });
}

export async function verifySubscriptionPayment(
  transactionId: string
): Promise<PaymentVerificationResponse> {
  return paymentGateway.verifyPayment({ transactionId });
}
