const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryPartner',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  skillCategory: {
    type: String,
    required: true,
    trim: true
  },
  timeLimit: {
    type: Number,
    required: true,
    min: 1,
    description: 'Time limit in minutes'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

assessmentSchema.index({ partnerId: 1 });
assessmentSchema.index({ skillCategory: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
