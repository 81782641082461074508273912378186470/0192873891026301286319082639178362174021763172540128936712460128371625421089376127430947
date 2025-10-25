# Environment Setup Guide

To configure the Faspay payment integration properly, you'll need to set up the following environment variables in your `.env.local` file:

```bash
# Application URL (used for payment callbacks)
# Production: https://www.autolaku.com
# Development: http://localhost:3000
NEXT_PUBLIC_APP_URL=https://www.autolaku.com

# Faspay Payment Gateway Configuration
# Sandbox credentials provided by Faspay support
FASPAY_MERCHANT_ID=36480
FASPAY_USER_ID=bot36480
FASPAY_PASSWORD=p@ssw0rd
FASPAY_ENVIRONMENT=sandbox
FASPAY_BASE_URL=https://xpress-sandbox.faspay.co.id

# JWT Secret for authentication
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_secure_jwt_secret_here

# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autolaku
```

## Important Configuration Notes

1. **NEXT_PUBLIC_APP_URL**:
   - Must be set to your actual domain (e.g., `https://www.autolaku.com`)
   - Used to generate return URLs for Faspay
   - Used in webhook processing

2. **Faspay Credentials**:
   - Use sandbox credentials for testing
   - Switch to production credentials when going live

3. **Faspay URL Registration**:
   - You must register these URLs with Faspay support:
     - Webhook URL: `https://www.autolaku.com/api/payments/webhook`
     - Success URL: `https://www.autolaku.com/subscription/success`
     - Failure URL: `https://www.autolaku.com/subscription/failure`

4. **Testing Process**:
   - Use Faspay simulator: https://simulator.faspay.co.id/simulator
   - Follow UAT process as directed by Faspay support

## Production Deployment

When deploying to production:

1. Set `NEXT_PUBLIC_APP_URL` to your actual production domain
2. Register the production URLs with Faspay support
3. Update environment variables in your hosting platform
4. Test with small payment amounts before going live with actual transactions
