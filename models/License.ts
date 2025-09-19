import mongoose, { Schema, model, models } from 'mongoose';

const licenseSchema = new Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
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
    default: 'revoked',
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  whatsappNumber: {
    type: String,
    default: null,
    match: /^\+?[1-9]\d{1,14}$/,
  },
  // Online status tracking
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastSeenAt: {
    type: Date,
    default: null,
  },
  connectionEstablishedAt: {
    type: Date,
    default: null,
  },
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
});

const License = models.License || model('License', licenseSchema);

export default License;
