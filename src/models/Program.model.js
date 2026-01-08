const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  durationYears: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

programSchema.index({ universityId: 1 });
programSchema.index({ code: 1 });
programSchema.index({ isActive: 1 });

module.exports = mongoose.model('Program', programSchema);
