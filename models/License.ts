import mongoose, { Schema, model, models } from 'mongoose';

const licenseSchema = new Schema({
  key: { type: String, required: true, unique: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Allow null values
  deviceId: { type: String, default: null },
  deviceName: { type: String, default: null },
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
