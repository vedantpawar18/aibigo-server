const mongoose = require('mongoose');

const visibilityRulesSchema = new mongoose.Schema({
  programs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }],
  plans: [{
    type: String,
    enum: ['BASIC', 'PREMIUM', 'ENTERPRISE']
  }]
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true,
    example: '12 weeks'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  registrationUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid URL format'
    }
  },
  visibilityRules: {
    type: visibilityRulesSchema,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

courseSchema.index({ title: 1 });
courseSchema.index({ isActive: 1 });

module.exports = mongoose.model('Course', courseSchema);
