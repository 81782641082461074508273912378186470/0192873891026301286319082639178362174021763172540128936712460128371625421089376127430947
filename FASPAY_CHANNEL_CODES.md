# Faspay Payment Channel Codes Reference

## ✅ Correct ShopeePay QRIS Channel Code

According to [Faspay's official ShopeePay QRIS Integration Guide](https://docs.faspay.co.id/merchant-integration/api-reference-1/debit-transaction/e-money-channel-integration-guide/shopeepay-qris-integration), the correct payment channel code is:

```
payment_channel: ['711']
```

**NOT** `qris_shopeepay` or any other string!

---

## Common Faspay Payment Channel Codes

Based on Faspay Xpress v4 documentation:

| Channel Code | Payment Method | Description |
|--------------|----------------|-------------|
| `711` | ShopeePay QRIS | QRIS payment via ShopeePay |
| `402` | BCA Virtual Account | Virtual Account BCA |
| `408` | Permata Virtual Account | Virtual Account Permata |
| `403` | Mandiri Virtual Account | Virtual Account Mandiri |
| `801` | OVO | OVO e-wallet |
| `701` | GoPay | GoPay e-wallet |

*Note: Refer to official Faspay documentation for complete list of channel codes.*

---

## Implementation in PaymentUtils.ts

```typescript
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
  payment_channel: ['711'], // ✅ Correct: 711 for ShopeePay QRIS
  signature: signature,
  item: [
    {
      product: request.description,
      qty: '1',
      amount: request.amount.toString(),
      payment_plan: '01',
      merchant_id: this.config.merchantId,
      tenor: '00',
    },
  ],
};
```

---

## Why This Matters

Using incorrect channel codes can cause:
- ❌ 500 Internal Server Error from Faspay
- ❌ Payment request rejection
- ❌ Database errors on Faspay's side

Always verify channel codes from official documentation:
- [Faspay ShopeePay QRIS Integration](https://docs.faspay.co.id/merchant-integration/api-reference-1/debit-transaction/e-money-channel-integration-guide/shopeepay-qris-integration)
- [Faspay Xpress v4 Documentation](https://docs.faspay.co.id/merchant-integration/api-reference-1/xpress/xpress-version-4)

---

## Testing

After fixing the channel code:
1. Deploy the updated code
2. Try registration again
3. Verify QRIS QR code is generated
4. Test payment flow end-to-end

---

**Last Updated:** October 25, 2025  
**Status:** ✅ Channel code corrected to `711`
