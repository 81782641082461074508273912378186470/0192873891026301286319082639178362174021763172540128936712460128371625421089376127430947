import mongoose, { Schema, model, models } from 'mongoose';

const activitySchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  licenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'License', default: null },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  action: {
    type: String,
    required: true,
    enum: [
      'Account_Login',
      'Account_Logout',
      'License_Login',
      'License_Logout',
      'Scraping_Start',
      'Scraping_Stop',
      'Searching_Product_Start',
      'Searching_Product_Stop',
    ],
  },
  platform: {
    type: String,
    required: true,
    enum: ['Website', 'App'],
  },
  timestamp: { type: Date, default: Date.now },
  details: { type: Schema.Types.Mixed, default: {} },
  sessionId: { type: String, default: null },
});

activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ licenseId: 1, timestamp: -1 });
activitySchema.index({ adminId: 1, timestamp: -1 });
activitySchema.index({ action: 1 });

const Activity = models.Activity || model('Activity', activitySchema);

export default Activity;
