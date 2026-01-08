const mongoose = require('mongoose');

const industryPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

industryPartnerSchema.index({ name: 1 });

module.exports = mongoose.model('IndustryPartner', industryPartnerSchema);
