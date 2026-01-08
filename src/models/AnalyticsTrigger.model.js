const mongoose = require('mongoose');

const analyticsTriggerSchema = new mongoose.Schema({
  triggerType: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'],
    required: true
  },
  reportType: {
    type: String,
    enum: ['USAGE', 'PERFORMANCE', 'REVENUE', 'ENGAGEMENT', 'CUSTOM'],
    required: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastRunAt: {
    type: Date
  }
}, {
  timestamps: true
});

analyticsTriggerSchema.index({ triggerType: 1, reportType: 1 });
analyticsTriggerSchema.index({ isActive: 1 });

module.exports = mongoose.model('AnalyticsTrigger', analyticsTriggerSchema);
