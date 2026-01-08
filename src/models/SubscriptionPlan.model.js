const mongoose = require('mongoose');

const featuresSchema = new mongoose.Schema({
  aiSummary: {
    type: Boolean,
    default: false
  },
  industryAssessments: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const limitsSchema = new mongoose.Schema({
  students: {
    type: Number,
    default: 0
  },
  aiUsage: {
    type: Number,
    default: 0
  }
}, { _id: false });

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['BASIC', 'PREMIUM', 'ENTERPRISE'],
    unique: true
  },
  features: {
    type: featuresSchema,
    required: true
  },
  limits: {
    type: limitsSchema,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

subscriptionPlanSchema.index({ name: 1 });
subscriptionPlanSchema.index({ isActive: 1 });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
