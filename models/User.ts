import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // Removes extra spaces
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['owner', 'admin', 'user'],
      required: true,
    },
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      default: null, // Null for non-admin accounts
    },
    deviceId: {
      type: String,
      default: null, // Null for accounts without a specific device
    },
    email: {
      type: String,
      required: true, // Ensure all accounts have an email
      unique: true,
      lowercase: true,
      trim: true, // Clean up spaces
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // Email validation regex
    },
    name: {
      type: String,
      required: true,
      trim: true, // Clean up spaces
    },
    whatsappNumber: {
      type: String,
      default: null, // Optional for users without a WhatsApp number
      match: /^\+?[1-9]\d{1,14}$/, // Validate international phone numbers
    },
    subscription: {
      type: {
        expireDate: {
          type: Date,
          default: null, // Optional for accounts without expiration
        },
        isActive: {
          type: Boolean,
          default: true, // Active by default
        },
      },
      default: null, // Null for accounts without subscriptions
    },
    // Status flag for soft delete or account suspension
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Efficient indexing for faster lookups
userSchema.index({ username: 1, email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'subscription.expireDate': 1 });

const User = models.User || model('User', userSchema);

export default User;
