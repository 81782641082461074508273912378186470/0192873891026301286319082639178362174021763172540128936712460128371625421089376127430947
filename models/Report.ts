import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['bug', 'feature', 'support'],
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 5000,
  },
  systemInfo: {
    platform: { type: String, required: true },
    userAgent: { type: String, required: true },
    appVersion: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  adminNotes: {
    type: String,
    maxlength: 2000,
  },
  resolvedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
reportSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
reportSchema.index({ reportId: 1 });
reportSchema.index({ type: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
