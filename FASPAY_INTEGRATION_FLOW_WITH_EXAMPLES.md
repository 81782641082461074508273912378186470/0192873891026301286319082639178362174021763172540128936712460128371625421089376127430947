# 🔄 Complete Faspay Integration Flow with Examples

**Date:** October 28, 2025  
**Merchant:** Autolaku Dropship (ID: 36480)

---

## 📊 Complete Payment Flow Diagram

```
┌──────────────┐
│   Customer   │
│   Registers  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Registration & Payment Initiation                   │
│ Your Backend: /api/auth/register                            │
└──────┬──────────────────────────────────────────────────────┘
       │
       │ POST Request to Faspay Xpress v4
       │ https://xpress-sandbox.faspay.co.id/v4/post
       │
       │ {
       │   "merchant_id": "36480",
       │   "bill_no": "AUTOLAKU-1730123456-001",
       │   "bill_total": "100000",
       │   "payment_channel": ["711"],
       │   "signature": "sha1(md5(...))",
       │   ...
       │ }
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Faspay Returns QRIS Page URL                        │
│ Response from Faspay                                         │
└──────┬──────────────────────────────────────────────────────┘
       │
       │ {
       │   "response_code": "00",
       │   "redirect_url": "https://xpress-sandbox.faspay.co.id/qris/..."
       │ }
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: User Redirected to Faspay QRIS Page                 │
│ User sees QR Code and payment instructions                  │
└──────┬──────────────────────────────────────────────────────┘
       │
       │ User scans QR Code with ShopeePay/any e-wallet
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: User Completes Payment                              │
│ ShopeePay processes payment                                 │
└──────┬──────────────────────────────────────────────────────┘
       │
       ├─────────────────────────────────────────────────┐
       │                                                 │
       ▼                                                 ▼
┌──────────────────────┐                    ┌──────────────────────────┐
│ PATH A: Return URL   │                    │ PATH B: Webhook          │
│ (User's Browser)     │                    │ (Server-to-Server)       │
└──────┬───────────────┘                    └──────┬───────────────────┘
       │                                            │
       │ GET Redirect                               │ POST JSON
       │                                            │
       ▼                                            ▼
┌──────────────────────────────────────┐   ┌────────────────────────────────┐
│ /subscription/success                │   │ /api/payments/webhook          │
│ ?trx_id=xxx&bill_no=xxx&status=0     │   │                                │
└──────┬───────────────────────────────┘   └──────┬─────────────────────────┘
       │                                            │
       │ Display "Processing..." page               │ Validate signature ✅
       │ Start polling /api/subscription/status     │ Update subscription ✅
       │                                            │ Activate user account ✅
       │                                            │ Return response "00" ✅
       │                                            │
       │◄───────────────────────────────────────────┘
       │
       │ Polling detects account is active
       │
       ▼
┌──────────────────────────────────────┐
│ Show "Login" Button                  │
│ User can now login!                  │
└──────────────────────────────────────┘
```

---

## 🔍 Detailed Request & Response Examples

### 1️⃣ Payment Initiation (Your Backend → Faspay)

**Endpoint:** `POST https://xpress-sandbox.faspay.co.id/v4/post`

**Request:**
```json
{
  "merchant_id": "36480",
  "bill_no": "AUTOLAKU-1730123456-001",
  "bill_date": "2025-10-28 10:25:00",
  "bill_expired": "2025-10-29 10:25:00",
  "bill_desc": "Autolaku Premium Plan Subscription",
  "bill_total": "100000",
  "cust_no": "user123",
  "cust_name": "John Doe",
  "return_url": "https://www.autolaku.com/subscription/success",
  "msisdn": "081234567890",
  "email": "john@example.com",
  "payment_channel": ["711"],
  "signature": "a1b2c3d4e5f6...",
  "item": [
    {
      "product": "Autolaku Premium Plan Subscription",
      "qty": "1",
      "amount": "100000",
      "payment_plan": "01",
      "merchant_id": "36480",
      "tenor": "00"
    }
  ]
}
```

**Signature Formula:**
```
SHA1(MD5("bot36480" + "p@ssw0rd" + "AUTOLAKU-1730123456-001" + "100000"))
```

**Response from Faspay:**
```json
{
  "response_code": "00",
  "response_desc": "Success",
  "trx_id": "3648040500001234",
  "redirect_url": "https://xpress-sandbox.faspay.co.id/qris/payment/3648040500001234"
}
```

---

### 2️⃣ Return URL / Callback (Faspay → User's Browser)

**When:** After user completes/cancels payment on Faspay page

**URL:** `GET https://www.autolaku.com/subscription/success`

**Full Example:**
```
https://www.autolaku.com/subscription/success?trx_id=3648040500001234&merchant_id=36480&merchant=Autolaku+Dropship&bill_no=AUTOLAKU-1730123456-001&bill_ref=AUTOLAKU-1730123456-001&bill_total=100000&bank_user_name=John+Doe&status=0&signature=abc123def456...
```

**Query Parameters:**
| Parameter | Example Value | Description |
|-----------|---------------|-------------|
| `trx_id` | `3648040500001234` | Faspay transaction ID |
| `merchant_id` | `36480` | Your merchant ID |
| `merchant` | `Autolaku Dropship` | Your merchant name |
| `bill_no` | `AUTOLAKU-1730123456-001` | Your order number |
| `bill_ref` | `AUTOLAKU-1730123456-001` | Bill reference |
| `bill_total` | `100000` | Payment amount |
| `bank_user_name` | `John Doe` | Customer name |
| `status` | `0` | Status code (0=pending, 1=success, 2=failed) |
| `signature` | `abc123...` | Validation signature |

**⚠️ IMPORTANT:** This is for **DISPLAY ONLY**. Do NOT activate accounts based on this!

**What Your Page Does:**
```typescript
// /app/(public)/subscription/success/page.tsx
1. Parse query parameters
2. Display "Processing payment..." message
3. Start polling /api/subscription/status every 3 seconds
4. When account is active → Show "Login" button
```

---

### 3️⃣ Payment Notification Webhook (Faspay → Your Backend) ⭐ PRIMARY

**When:** Immediately after payment is confirmed (can happen before or after Return URL)

**Endpoint:** `POST https://www.autolaku.com/api/payments/webhook`

**Request from Faspay:**
```json
{
  "request": "Payment Notification",
  "trx_id": "3648040500001234",
  "merchant_id": "36480",
  "merchant": "Autolaku Dropship",
  "bill_no": "AUTOLAKU-1730123456-001",
  "payment_reff": "PAY123456789",
  "payment_date": "2025-10-28 10:30:45",
  "payment_status_code": "2",
  "payment_status_desc": "Payment Success",
  "bill_total": "100000",
  "payment_total": "100000",
  "payment_channel_uid": "711",
  "payment_channel": "ShopeePay QRIS",
  "signature": "xyz789abc456..."
}
```

**Signature Validation:**
```
Received: "xyz789abc456..."
Calculate: SHA1(MD5("bot36480" + "p@ssw0rd" + "AUTOLAKU-1730123456-001" + "2"))
                                                                              ↑
                                                                   payment_status_code
```

**Your Required Response:**
```json
{
  "response": "Payment Notification",
  "trx_id": "3648040500001234",
  "merchant_id": "36480",
  "bill_no": "AUTOLAKU-1730123456-001",
  "response_code": "00",
  "response_desc": "Success",
  "response_date": "2025-10-28 10:30:46"
}
```

**What Your Webhook Does:**
```typescript
// /app/api/payments/webhook/route.ts
1. Validate signature ✅
2. Find subscription by bill_no ✅
3. Update subscription status to "active" ✅
4. Update user.isActive = true ✅
5. Update user.licenseLimit ✅
6. Return "00" response to Faspay ✅
```

**Payment Status Codes:**
| Code | Description |
|------|-------------|
| `"2"` | Payment Success |
| `"3"` | Payment Failed |
| `"5"` | No bills found |
| `"7"` | Payment Expired |
| `"8"` | Payment Cancelled |

---

### 4️⃣ Status Polling (User's Browser → Your Backend)

**When:** While user waits on success page

**Endpoint:** `GET https://www.autolaku.com/api/subscription/status?email=john@example.com`

**Request:**
```
GET /api/subscription/status?email=john@example.com
```

**Response (Before Webhook):**
```json
{
  "success": true,
  "isActive": false,
  "subscription": {
    "status": "pending",
    "plan": "premium",
    "licenseLimit": 10
  }
}
```

**Response (After Webhook):**
```json
{
  "success": true,
  "isActive": true,
  "subscription": {
    "status": "active",
    "plan": "premium",
    "licenseLimit": 10
  }
}
```

---

## 🎯 Timeline Example

Real-world timing of events:

```
10:25:00 - User clicks "Register" button
10:25:01 - Your backend creates pending user & subscription
10:25:02 - POST to Faspay Xpress v4 API
10:25:03 - Faspay returns QRIS page URL
10:25:04 - User redirected to Faspay QRIS page
10:25:05 - User sees QR code
10:25:30 - User scans QR with ShopeePay
10:25:35 - User confirms payment in ShopeePay
10:25:40 - ShopeePay processes payment

--- Payment Complete ---

10:25:45 - Faspay redirects user to /subscription/success
10:25:45 - Faspay sends webhook to /api/payments/webhook
10:25:46 - Your webhook validates signature ✅
10:25:46 - Your webhook activates user account ✅
10:25:46 - Your webhook returns "00" to Faspay ✅
10:25:47 - Success page polls /api/subscription/status
10:25:47 - Poll detects isActive = true
10:25:47 - Success page shows "Login" button

--- User Can Login! ---

10:25:50 - User clicks "Login"
10:25:51 - User successfully logs in
10:25:52 - Dashboard loads with full access
```

**Note:** Webhook can arrive before or after the Return URL redirect. That's why we poll!

---

## 📧 Email to Send to Faspay

Copy the content from `EMAIL_TO_FASPAY.md` and send it to: **support@faspay.co.id**

The email includes:
- ✅ Both URLs with full examples
- ✅ Expected request/response formats
- ✅ Merchant details (ID: 36480)
- ✅ Payment channel (QRIS 711)

---

## ✅ Verification Checklist

After Faspay confirms URL registration, verify:

- [ ] Payment initiation creates QRIS page
- [ ] User can scan and pay successfully
- [ ] User redirected to `/subscription/success`
- [ ] Webhook received with correct format
- [ ] Signature validation passes
- [ ] User account activated (isActive = true)
- [ ] Success page detects activation via polling
- [ ] User can login after activation
- [ ] Dashboard loads with correct license limit

---

**Ready to test after Faspay registers your URLs!** 🚀

