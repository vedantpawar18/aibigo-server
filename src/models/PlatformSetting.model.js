const mongoose = require('mongoose');

const platformSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  targetPlans: [{
    type: String,
    enum: ['BASIC', 'PREMIUM', 'ENTERPRISE', 'ALL'],
    default: 'ALL'
  }],
  description: {
    type: String,
    trim: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

platformSettingSchema.index({ key: 1 });
platformSettingSchema.index({ targetPlans: 1 });

module.exports = mongoose.model('PlatformSetting', platformSettingSchema);
