const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  subscriptionPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  invoiceRef: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'CHEQUE', 'OTHER'],
    default: 'BANK_TRANSFER'
  },
  transactionId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

paymentSchema.index({ instituteId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
