const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    default: 'India',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

universitySchema.index({ code: 1 });
universitySchema.index({ state: 1 });
universitySchema.index({ isActive: 1 });

module.exports = mongoose.model('University', universitySchema);
