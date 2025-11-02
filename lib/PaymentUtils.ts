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
  PaymentMethod,
  PaymentMethodConfig,
} from '@/types/payment';

// Default configuration for Faspay sandbox environment
const DEFAULT_CONFIG: FaspayConfig = {
  merchantId: process.env.FASPAY_MERCHANT_ID || '36480',
  userId: process.env.FASPAY_USER_ID || 'bot36480',
  password: process.env.FASPAY_PASSWORD || 'p@ssw0rd',
  environment: process.env.FASPAY_ENVIRONMENT === 'production' ? 'production' : 'sandbox',
  baseUrl: process.env.FASPAY_BASE_URL || 'https://xpress-sandbox.faspay.co.id',
};

// Payment Method Configurations
export const PAYMENT_METHODS: Record<PaymentMethod, PaymentMethodConfig> = {
  // QRIS/E-Wallet
  shopeepay_qris: {
    id: 'shopeepay_qris',
    name: 'ShopeePay QRIS',
    category: 'qris',
    channelCode: '711',
    description: 'Scan QR code with any e-wallet app',
    enabled: true,
  },
  gopay: {
    id: 'gopay',
    name: 'GoPay',
    category: 'e_wallet',
    channelCode: '701',
    description: 'Pay with GoPay e-wallet',
    enabled: true,
    testCredentials: { phone: '081234567890' },
  },
  dana: {
    id: 'dana',
    name: 'DANA',
    category: 'e_wallet',
    channelCode: '702',
    description: 'Pay with DANA e-wallet',
    enabled: true,
    testCredentials: { phone: '0817345545', pin: '123321' },
  },
  ovo: {
    id: 'ovo',
    name: 'OVO',
    category: 'e_wallet',
    channelCode: '801',
    description: 'Pay with OVO e-wallet',
    enabled: true,
    testCredentials: { phone: '081234567890' },
  },
  linkaja: {
    id: 'linkaja',
    name: 'LinkAja',
    category: 'e_wallet',
    channelCode: '805',
    description: 'Pay with LinkAja e-wallet',
    enabled: true,
    testCredentials: { phone: '081234567890', pin: '000000', otp: '000000' },
  },
  blu_bca: {
    id: 'blu_bca',
    name: 'Blu BCA',
    category: 'e_wallet',
    channelCode: 'blu',
    description: 'Pay with Blu by BCA Digital',
    enabled: true,
    testCredentials: { phone: '081234567890' },
  },

  // Credit Card
  credit_card: {
    id: 'credit_card',
    name: 'Credit Card',
    category: 'credit_card',
    channelCode: 'credit_card',
    description: 'Visa, MasterCard, JCB, Amex',
    enabled: true,
    testCredentials: {
      visa: '4440000009900010',
      mastercard: '5123450000000008',
      exp: '01/39',
      cvv: '100',
    },
  },

  // Virtual Account
  bca_va: {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    category: 'virtual_account',
    channelCode: '402',
    description: 'Transfer via BCA Virtual Account',
    enabled: true,
  },
  mandiri_va: {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    category: 'virtual_account',
    channelCode: '403',
    description: 'Transfer via Mandiri Virtual Account',
    enabled: true,
  },
  bri_va: {
    id: 'bri_va',
    name: 'BRI Virtual Account',
    category: 'virtual_account',
    channelCode: '410',
    description: 'Transfer via BRI Virtual Account',
    enabled: true,
  },
  bni_va: {
    id: 'bni_va',
    name: 'BNI Virtual Account',
    category: 'virtual_account',
    channelCode: '411',
    description: 'Transfer via BNI Virtual Account',
    enabled: true,
  },
  permata_va: {
    id: 'permata_va',
    name: 'Permata Virtual Account',
    category: 'virtual_account',
    channelCode: '408',
    description: 'Transfer via Permata Virtual Account',
    enabled: true,
  },
  maybank_va: {
    id: 'maybank_va',
    name: 'Maybank Virtual Account',
    category: 'virtual_account',
    channelCode: '412',
    description: 'Transfer via Maybank Virtual Account',
    enabled: true,
  },
  danamon_va: {
    id: 'danamon_va',
    name: 'Danamon Virtual Account',
    category: 'virtual_account',
    channelCode: '413',
    description: 'Transfer via Danamon Virtual Account',
    enabled: true,
  },
  sinarmas_va: {
    id: 'sinarmas_va',
    name: 'Sinarmas Virtual Account',
    category: 'virtual_account',
    channelCode: '414',
    description: 'Transfer via Sinarmas Virtual Account',
    enabled: true,
  },
  cimb_va: {
    id: 'cimb_va',
    name: 'CIMB Virtual Account',
    category: 'virtual_account',
    channelCode: '415',
    description: 'Transfer via CIMB Virtual Account',
    enabled: true,
  },

  // Internet Banking
  bca_klikpay: {
    id: 'bca_klikpay',
    name: 'BCA KlikPay',
    category: 'internet_banking',
    channelCode: 'bca_klikpay',
    description: 'Pay via BCA KlikPay',
    enabled: true,
    testCredentials: { email: 'faspay@faspay.co.id', password: 'password', otp: '101010' },
  },
  bri_epay: {
    id: 'bri_epay',
    name: 'BRI E-pay',
    category: 'internet_banking',
    channelCode: 'bri_epay',
    description: 'Pay via BRI E-pay',
    enabled: true,
    testCredentials: { username: 'faspay', password: 'password', otp: '101010' },
  },
  danamon_online: {
    id: 'danamon_online',
    name: 'Danamon Online Banking',
    category: 'internet_banking',
    channelCode: 'danamon_online',
    description: 'Pay via Danamon Online Banking',
    enabled: true,
    testCredentials: { username: 'faspay', password: 'password', otp: '10101010' },
  },
  maybank2u: {
    id: 'maybank2u',
    name: 'Maybank2U',
    category: 'internet_banking',
    channelCode: 'maybank2u',
    description: 'Pay via Maybank2U',
    enabled: true,
    testCredentials: { username: 'faspay', password: 'Faspay123!@#', otp: '10101010' },
  },
  octo_clicks: {
    id: 'octo_clicks',
    name: 'CIMB Clicks',
    category: 'internet_banking',
    channelCode: 'octo_clicks',
    description: 'Pay via CIMB Clicks',
    enabled: true,
    testCredentials: { username: 'faspay', payCode: '101010' },
  },

  // Retail Payment
  indomaret: {
    id: 'indomaret',
    name: 'Indomaret',
    category: 'retail_payment',
    channelCode: 'indomaret',
    description: 'Pay at Indomaret stores',
    enabled: true,
  },
  alfamart: {
    id: 'alfamart',
    name: 'Alfamart',
    category: 'retail_payment',
    channelCode: 'alfamart',
    description: 'Pay at Alfamart stores',
    enabled: true,
  },

  // Online Credit
  kredivo: {
    id: 'kredivo',
    name: 'Kredivo',
    category: 'online_credit',
    channelCode: 'kredivo',
    description: 'Pay later with Kredivo',
    enabled: true,
    testCredentials: {
      fullPayment: { username: '081513114262', password: '663482', otp: '4567' },
      installment: { username: '081291891818', password: '414141', otp: '4567' },
    },
  },
};

// Helper function to get enabled payment methods
export function getEnabledPaymentMethods(): PaymentMethodConfig[] {
  return Object.values(PAYMENT_METHODS).filter((method) => method.enabled);
}

// Helper function to get payment methods by category
export function getPaymentMethodsByCategory(category: string): PaymentMethodConfig[] {
  return Object.values(PAYMENT_METHODS).filter(
    (method) => method.enabled && method.category === category
  );
}

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

    if (this.config.environment !== 'production') {
      console.log('🔐 Webhook signature validation:', {
        formula: 'SHA1(MD5(user_id + password + bill_no + payment_status_code))',
        user_id: this.config.userId,
        bill_no: bill_no,
        payment_status_code: payment_status_code,
        calculated_signature: sha1Hash,
      });
    }

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
   * Create a new payment transaction via Faspay
   * @param request Payment request data
   * @param paymentMethod Payment method to use (defaults to ShopeePay QRIS)
   * @returns Payment response with redirect URL to payment page
   */
  async createPayment(
    request: CreatePaymentRequest,
    paymentMethod: PaymentMethod = 'shopeepay_qris'
  ): Promise<PaymentResponse> {
    try {
      // Generate unique bill number
      const bill_no = this.generateBillNo();

      // Calculate dates
      const now = new Date();
      const expired = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

      // Get payment method configuration
      const methodConfig = PAYMENT_METHODS[paymentMethod];
      if (!methodConfig || !methodConfig.enabled) {
        return {
          success: false,
          message: `Payment method ${paymentMethod} is not available`,
          errorCode: 'INVALID_PAYMENT_METHOD',
        };
      }

      // Generate signature with bill_no and bill_total
      const bill_total = request.amount.toString();
      const signature = this.generateSignature(bill_no, bill_total);

      if (this.config.environment !== 'production') {
        console.log('🔐 Signature generation:', {
          formula: 'SHA1(MD5(user_id + password + bill_no + bill_total))',
          user_id: this.config.userId,
          bill_no: bill_no,
          bill_total: bill_total,
          signature: signature,
          paymentMethod: paymentMethod,
          channelCode: methodConfig.channelCode,
        });
      }

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
        payment_channel: [methodConfig.channelCode], // Use selected payment method
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
      if (this.config.environment !== 'production') {
        console.log('🚀 Sending Faspay payment request:', {
          endpoint: `${this.baseUrl}/v4/post`,
          bill_no: payload.bill_no,
          bill_total: payload.bill_total,
          merchant_id: payload.merchant_id,
          payment_channel: payload.payment_channel,
          payment_method: paymentMethod,
          method_name: methodConfig.name,
          item: payload.item,
        });
      }

      // Call Faspay Xpress API
      const response = await axios.post(`${this.baseUrl}/v4/post`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = response.data as any;

      if (this.config.environment !== 'production') {
        console.log('✅ Faspay response received:', {
          response_code: responseData.response_code,
          response_desc: responseData.response_desc,
          redirect_url: responseData.redirect_url ? 'URL provided' : 'No URL',
        });
      }

      // Check if request was successful
      if (responseData.response_code === '00') {
        return {
          success: true,
          message: `${methodConfig.name} payment initiated successfully`,
          transactionId: bill_no,
          paymentUrl: responseData.redirect_url,
          status: 'pending',
        };
      } else {
        return {
          success: false,
          message: responseData.response_desc || `Failed to create ${methodConfig.name} payment`,
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
        message: error.response?.data?.response_desc || 'Failed to create payment',
        errorCode: error.response?.data?.response_code || '500',
      };
    }
  }

  /**
   * Create a QRIS payment (backward compatibility)
   * @param request Payment request data
   * @returns Payment response with redirect URL to QRIS page
   */
  async createQRISPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    return this.createPayment(request, 'shopeepay_qris');
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
        status = 'failed'; // Expired
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

      if (this.config.environment !== 'production') {
        console.log('🔍 Signature comparison:', {
          received: rawData.signature,
          expected: expectedSignature,
          match: expectedSignature === rawData.signature,
        });
      }

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

// Helper functions for payment operations
export async function createSubscriptionPayment(
  plan: string,
  amount: number,
  customerName: string,
  customerEmail: string,
  customerNumber: string,
  paymentMethod: PaymentMethod = 'shopeepay_qris',
  customerPhone?: string,
  metadata?: Record<string, any>
): Promise<PaymentResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://autolaku.com';

  return paymentGateway.createPayment(
    {
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
        paymentMethod,
        ...metadata,
      },
    },
    paymentMethod
  );
}

// Backward compatibility function
export async function createQRISSubscriptionPayment(
  plan: string,
  amount: number,
  customerName: string,
  customerEmail: string,
  customerNumber: string,
  customerPhone?: string,
  metadata?: Record<string, any>
): Promise<PaymentResponse> {
  return createSubscriptionPayment(
    plan,
    amount,
    customerName,
    customerEmail,
    customerNumber,
    'shopeepay_qris',
    customerPhone,
    metadata
  );
}

export async function verifySubscriptionPayment(
  transactionId: string
): Promise<PaymentVerificationResponse> {
  return paymentGateway.verifyPayment({ transactionId });
}
