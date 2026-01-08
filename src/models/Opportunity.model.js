const mongoose = require('mongoose');

const eligibilitySchema = new mongoose.Schema({
  programs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }],
  years: [{
    type: Number
  }],
  plans: [{
    type: String,
    enum: ['BASIC', 'PREMIUM', 'ENTERPRISE']
  }]
}, { _id: false });

const opportunitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['JOB', 'INTERNSHIP', 'WORKSHOP', 'COMPETITION']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  applyUrl: {
    type: String,
    trim: true
  },
  eligibility: {
    type: eligibilitySchema,
    default: {}
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

opportunitySchema.index({ type: 1 });
opportunitySchema.index({ expiryDate: 1 });
opportunitySchema.index({ isActive: 1 });

module.exports = mongoose.model('Opportunity', opportunitySchema);
