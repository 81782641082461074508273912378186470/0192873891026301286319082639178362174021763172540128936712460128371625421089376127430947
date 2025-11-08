import { Schema, model, models } from 'mongoose';

const planPricingSchema = new Schema(
  {
    cycle: { type: String, enum: ['monthly', 'annual'], required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: 'IDR' },
    discountLabel: { type: String },
  },
  { _id: false }
);

const planFeatureSchema = new Schema(
  {
    featureKey: { type: String, required: true },
    limit: { type: Number, default: null },
  },
  { _id: false }
);

const planCatalogSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    licenseLimit: { type: Number, required: true, min: 0 },
    pricing: { type: [planPricingSchema], default: [] },
    features: { type: [planFeatureSchema], default: [] },
    availableAddOnKeys: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    version: { type: Number, default: 1 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

planCatalogSchema.index({ slug: 1 }, { unique: true });
planCatalogSchema.index({ status: 1 });

const PlanCatalog = models.PlanCatalog || model('PlanCatalog', planCatalogSchema);

export default PlanCatalog;

