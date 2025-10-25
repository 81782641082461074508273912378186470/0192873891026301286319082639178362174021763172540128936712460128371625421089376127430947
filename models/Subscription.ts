import mongoose, { Schema, model, models } from 'mongoose';

// Define payment history schema as a subdocument
const paymentHistorySchema = new Schema({
  transactionId: { type: String, required: true }, // Our bill_no
  faspayTrxId: { type: String }, // Faspay's trx_id
  amount: { type: Number, required: true },
  currency: { type: String, default: 'IDR' },
  paymentMethod: { type: String, required: true }, // payment_channel
  paymentGateway: { type: String, required: true, default: 'faspay' },
  paymentChannelUid: { type: String }, // payment_channel_uid from Faspay
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paidAt: { type: Date, default: Date.now },
  invoiceUrl: { type: String },
}, { timestamps: true });

// Define add-on schema as a subdocument
const addOnSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  active: { type: Boolean, default: true },
});

// Main subscription schema
const subscriptionSchema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true 
    },
    plan: {
      type: String,
      enum: ['starter', 'basic', 'pro', 'enterprise'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'pending'],
      default: 'pending',
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    licenseLimit: { 
      type: Number, 
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
    },
    paymentHistory: [paymentHistorySchema],
    addOns: [addOnSchema],
    // Pricing information for reference
    basePrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }, // Including add-ons
    // Metadata
    notes: { type: String },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

// Create indexes for better performance
subscriptionSchema.index({ userId: 1 }, { unique: true });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ 'paymentHistory.transactionId': 1 });

// Static method to get license limit based on plan
subscriptionSchema.statics.getLicenseLimitByPlan = function(plan: string): number {
  const limits = {
    starter: 5,
    basic: 10,
    pro: 20,
    enterprise: 50, // Default for enterprise, can be customized
  };
  return limits[plan] || 0;
};

// Static method to get base price by plan
subscriptionSchema.statics.getBasePriceByPlan = function(plan: string): number {
  const prices = {
    starter: 20000, // IDR 20k
    basic: 60000,   // IDR 60k
    pro: 85000,     // IDR 85k
    enterprise: 100000, // IDR 100k
  };
  return prices[plan] || 0;
};

// Instance method to check if subscription is active
subscriptionSchema.methods.isActive = function(): boolean {
  const now = new Date();
  return this.status === 'active' && this.endDate > now;
};

// Pre-save hook to ensure totalPrice is calculated
subscriptionSchema.pre('save', function(next) {
  if (this.isModified('basePrice') || this.isModified('addOns')) {
    let addOnTotal = 0;
    if (this.addOns && this.addOns.length > 0) {
      addOnTotal = this.addOns
        .filter(addon => addon.active)
        .reduce((sum, addon) => sum + addon.price, 0);
    }
    this.totalPrice = this.basePrice + addOnTotal;
  }
  next();
});

const Subscription = models.Subscription || model('Subscription', subscriptionSchema);

export default Subscription;
