import mongoose, { Schema, model, models } from 'mongoose';

// Define payment history schema as a subdocument
const paymentHistorySchema = new Schema(
  {
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
      default: 'pending',
    },
    paidAt: { type: Date, default: Date.now },
    invoiceUrl: { type: String },
  },
  { timestamps: true }
);

// Define add-on schema as a subdocument
const addOnSchema = new Schema(
  {
    key: { type: String },
    name: { type: String },
    cycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
    quantity: { type: Number, default: 1, min: 1 },
    unitPrice: { type: Number },
    totalPrice: { type: Number },
    price: { type: Number }, // legacy support
  active: { type: Boolean, default: true },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
  },
  { _id: true }
);

const entitlementSchema = new Schema(
  {
    featureKey: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    limit: { type: Number, default: null },
    source: { type: String, enum: ['plan', 'add_on'], required: true },
    sourceKey: { type: String, required: true },
  },
  { _id: false }
);

const pricingSnapshotSchema = new Schema(
  {
    basePrice: { type: Number, required: true },
    addOnTotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, required: true, default: 'IDR' },
    catalogVersion: { type: Number },
  },
  { _id: false }
);

// Main subscription schema
const subscriptionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ['starter', 'basic', 'pro', 'enterprise'],
      required: true,
    },
    planSlug: {
      type: String,
    },
    planVersion: {
      type: Number,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual'],
      default: 'monthly',
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
    entitlements: { type: [entitlementSchema], default: [] },
    // Pricing information for reference
    basePrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }, // Including add-ons
    pricingSnapshot: { type: pricingSnapshotSchema },
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

// Instance method to check if subscription is active
subscriptionSchema.methods.isActive = function (): boolean {
  const now = new Date();
  return this.status === 'active' && this.endDate > now;
};

// Pre-save hook to ensure totalPrice is calculated
subscriptionSchema.pre('save', function (next) {
  if (this.pricingSnapshot && this.pricingSnapshot.total) {
    this.totalPrice = this.pricingSnapshot.total;
  } else if (this.isModified('basePrice') || this.isModified('addOns')) {
    let addOnTotal = 0;
    if (this.addOns && this.addOns.length > 0) {
      addOnTotal = this.addOns
        .filter((addon) => addon.active)
        .reduce((sum, addon) => {
          if (typeof addon.totalPrice === 'number') {
            return sum + addon.totalPrice;
          }
          if (typeof addon.unitPrice === 'number') {
            const quantity = addon.quantity && addon.quantity > 0 ? addon.quantity : 1;
            return sum + addon.unitPrice * quantity;
          }
          if (typeof addon.price === 'number') {
            return sum + addon.price;
          }
          return sum;
        }, 0);
    }
    this.totalPrice = this.basePrice + addOnTotal;
    this.pricingSnapshot = {
      basePrice: this.basePrice,
      addOnTotal,
      discountAmount: 0,
      total: this.totalPrice,
      currency: this.pricingSnapshot?.currency || 'IDR',
      catalogVersion: this.pricingSnapshot?.catalogVersion,
    };
  }
  next();
});

const Subscription = models.Subscription || model('Subscription', subscriptionSchema);

export default Subscription;
