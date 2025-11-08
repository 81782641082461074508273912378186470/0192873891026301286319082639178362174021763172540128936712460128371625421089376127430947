import { Schema, model, models } from 'mongoose';

const addOnPricingSchema = new Schema(
  {
    cycle: { type: String, enum: ['monthly', 'annual', 'one_time'], required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: 'IDR' },
  },
  { _id: false }
);

const featureAdjustmentSchema = new Schema(
  {
    featureKey: { type: String, required: true },
    enable: { type: Boolean, default: true },
    limitDelta: { type: Number, default: null },
  },
  { _id: false }
);

const addOnConstraintSchema = new Schema(
  {
    allowedPlanSlugs: { type: [String], default: [] },
    conflictingAddOnKeys: { type: [String], default: [] },
  },
  { _id: false }
);

const addOnCatalogSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    pricing: { type: [addOnPricingSchema], default: [] },
    featureAdjustments: { type: [featureAdjustmentSchema], default: [] },
    constraints: { type: addOnConstraintSchema, default: undefined },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

addOnCatalogSchema.index({ key: 1 }, { unique: true });
addOnCatalogSchema.index({ status: 1 });

const AddOnCatalog = models.AddOnCatalog || model('AddOnCatalog', addOnCatalogSchema);

export default AddOnCatalog;
