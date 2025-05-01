import mongoose, { Schema, model, models } from 'mongoose';

const activitySchema = new Schema(
  {
    entityType: {
      type: String,
      enum: ['user', 'license'],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'entityType',
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

activitySchema.index({ entityType: 1, entityId: 1 });
activitySchema.index({ adminId: 1 });
activitySchema.index({ action: 1 });
activitySchema.index({ timestamp: -1 });

const Activity = models.Activity || model('Activity', activitySchema);

export default Activity;
