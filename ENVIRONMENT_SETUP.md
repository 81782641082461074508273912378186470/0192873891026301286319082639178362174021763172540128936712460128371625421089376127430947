# 🔧 Environment Configuration Guide

This document explains how to configure environment variables for the Autolaku platform's subscription and payment system.

## 📋 Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### 1. Database Configuration

```bash
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autolaku
```

### 2. Authentication & Security

```bash
# JWT Secret for token signing (generate a strong random string)
# Generate with: openssl rand -base64 64
JWT_SECRET=your_very_secure_random_jwt_secret_here
```

### 3. Faspay Payment Gateway

```bash
# Faspay Merchant Credentials (provided by Faspay)
FASPAY_MERCHANT_ID=36480
FASPAY_USER_ID=bot36480
FASPAY_PASSWORD=p@ssw0rd

# Environment: 'sandbox' or 'production'
FASPAY_ENVIRONMENT=sandbox

# API Base URL
FASPAY_BASE_URL=https://xpress-sandbox.faspay.co.id
# Production URL: https://xpress.faspay.co.id
```

### 4. Application URL

```bash
# Your application's base URL (used for payment callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Production: https://autolaku.com
```

---

## 🚀 Getting Started

### Step 1: Create Environment File

```bash
# Copy the example template
cp .env.example .env.local

# Or create manually
touch .env.local
```

### Step 2: Fill in Values

Edit `.env.local` and replace placeholder values with your actual credentials.

### Step 3: Verify Configuration

```bash
# Check if environment variables are loaded
npm run dev
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Use strong, random JWT secrets (minimum 32 characters)
- Keep `.env.local` in `.gitignore` (already configured)
- Use different credentials for sandbox and production
- Rotate credentials periodically
- Use environment-specific files for different stages

### ❌ DON'T:
- Commit `.env.local` to version control
- Share credentials in public channels
- Use weak or predictable secrets
- Hardcode credentials in source code
- Use production credentials in development

---

## 🏗️ Faspay Integration Setup

### Webhook Configuration

Configure the following webhook URL in your Faspay merchant dashboard:

**Development (with ngrok or similar):**
```
https://your-ngrok-url.ngrok.io/api/payments/webhook
```

**Production:**
```
https://autolaku.com/api/payments/webhook
```

### Testing with Faspay Sandbox

1. Use sandbox credentials provided by Faspay
2. Set `FASPAY_ENVIRONMENT=sandbox`
3. Use sandbox base URL: `https://xpress-sandbox.faspay.co.id`
4. Test QRIS payments with Faspay test cards/apps

### Production Deployment

When deploying to production:

1. **Update Faspay Credentials:**
   ```bash
   FASPAY_MERCHANT_ID=your_production_merchant_id
   FASPAY_USER_ID=your_production_user_id
   FASPAY_PASSWORD=your_production_password
   FASPAY_ENVIRONMENT=production
   FASPAY_BASE_URL=https://xpress.faspay.co.id
   ```

2. **Update Application URL:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://autolaku.com
   ```

3. **Generate Strong JWT Secret:**
   ```bash
   openssl rand -base64 64
   ```

4. **Configure Production Database:**
   ```bash
   MONGODB_URI=mongodb+srv://prod_user:secure_password@prod_cluster.mongodb.net/autolaku_prod
   ```

---

## 📊 Subscription Plans

The following subscription plans are configured in the system:

| Plan | Price (IDR/month) | License Limit | Features |
|------|------------------|---------------|----------|
| **Starter** | 20,000 | 5 licenses | Basic features |
| **Basic** | 60,000 | 10 licenses | Priority support |
| **Pro** | 85,000 | 20 licenses | All features + discounts |
| **Enterprise** | 100,000 | 50 licenses | Custom solutions |

To modify plan configuration, edit:
- `models/Subscription.ts` - Static methods for limits and prices
- `lib/SubscriptionUtils.ts` - Helper functions
- `components/subscription/PlanSelector.tsx` - UI display
- `components/auth/Daftar.tsx` - Plan prices object

---

## 🧪 Testing the Registration Flow

### Test Admin Registration:

1. Go to `/auth` or registration page
2. Select "Akun Admin"
3. Fill in registration form:
   - Full name
   - Email address
   - WhatsApp number (optional)
   - Username
   - Password
4. Select a subscription plan
5. Click "Bayar dengan QRIS"
6. System creates pending user and subscription
7. Faspay payment page opens with QR code
8. Scan QR code with e-wallet/banking app
9. Complete payment
10. Faspay sends webhook to activate account
11. User can now login with username/password

### Test License Registration (Free):

1. Select "License Key"
2. Fill in name and email
3. Receive license key (revoked status)
4. Contact admin for activation

---

## 🐛 Troubleshooting

### Issue: Payment webhook not received

**Solution:**
- Verify webhook URL is configured in Faspay dashboard
- Check webhook URL is publicly accessible (use ngrok for local testing)
- Verify signature validation in `/app/api/payments/webhook/route.ts`
- Check server logs for webhook errors

### Issue: User cannot login after payment

**Solution:**
- Check if webhook was received and processed
- Verify user's `isActive` status in database: `db.users.findOne({username: 'xxx'})`
- Check subscription status: `db.subscriptions.findOne({userId: ObjectId('xxx')})`
- Manually activate: `db.users.updateOne({username: 'xxx'}, {$set: {isActive: true}})`

### Issue: Signature validation failed

**Solution:**
- Verify Faspay credentials are correct
- Check signature generation formula: `MD5(userId + password + bill_no)`
- Ensure no extra whitespace in environment variables
- Compare generated signature with received signature in logs

### Issue: "User already exists" error

**Solution:**
- Username or email already registered
- Check database: `db.users.findOne({$or: [{username: 'xxx'}, {email: 'xxx@email.com'}]})`
- Use different username/email or delete existing user (if test account)

---

## 📝 Environment Variables Reference

### Complete List

```bash
# Database
MONGODB_URI=

# Security
JWT_SECRET=

# Faspay Payment Gateway
FASPAY_MERCHANT_ID=
FASPAY_USER_ID=
FASPAY_PASSWORD=
FASPAY_ENVIRONMENT=
FASPAY_BASE_URL=

# Application
NEXT_PUBLIC_APP_URL=

# Optional: Email (future use)
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASSWORD=
# SMTP_FROM_NAME=
# SMTP_FROM_EMAIL=
```

### Validation Checklist

- [ ] All required variables are set
- [ ] JWT_SECRET is strong and random
- [ ] Faspay credentials match environment (sandbox/production)
- [ ] Webhook URL is configured in Faspay dashboard
- [ ] Application URL matches deployment environment
- [ ] MongoDB connection string is correct
- [ ] Variables are not committed to version control

---

## 🔗 Useful Commands

```bash
# Generate JWT secret
openssl rand -base64 64

# Test database connection
npm run dev
# Check console for MongoDB connection status

# View environment variables (development)
node -e "console.log(process.env)"

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📚 Additional Resources

- [Faspay Documentation](https://docs.faspay.co.id)
- [Faspay Xpress API v4](https://docs.faspay.co.id/merchant-integration/api-reference-1/xpress/xpress-version-4)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [MongoDB Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)

---

## 💬 Support

If you encounter issues:

1. Check this guide for troubleshooting steps
2. Review application logs for error messages
3. Verify all environment variables are set correctly
4. Test with Faspay sandbox before using production
5. Contact Faspay support for payment gateway issues

---

**Last Updated:** October 2025
**Version:** 1.0.0

