import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
      default: null,
    },
    deviceId: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: null,
      match: /^\+?[1-9]\d{1,14}$/,
    },
    subscription: {
      type: {
        expireDate: {
          type: Date,
          default: null,
        },
      },
      default: null,
    },
    licenseLimit: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.index({ username: 1, email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'subscription.expireDate': 1 });

const User = models.User || model('User', userSchema);

export default User;
