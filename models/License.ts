import mongoose, { Schema, model, models } from 'mongoose';

const licenseSchema = new Schema({
  key: { type: String, required: true, unique: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Allow null values
  deviceInfo: {
    type: {
      deviceName: { type: String, default: null },
      platform: { type: String, default: null },
      architecture: { type: String, default: null },
      cpuCores: { type: Number, default: null },
      osVersion: { type: String, default: null },
      totalMemory: { type: String, default: null },
      graphicsCard: { type: String, default: null },
      totalStorage: { type: String, default: null },
      deviceUniqueID: { type: String, default: null },
    },
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked'],
    default: 'active',
  },
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null }, // Allow null for no expiration
});

const License = models.License || model('License', licenseSchema);

export default License;
