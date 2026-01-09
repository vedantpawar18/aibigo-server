const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_FAILURE',
      'PASSWORD_RESET',
      'ROLE_ASSIGNMENT',
      'ADMIN_CREATION',
      'ACCOUNT_SUSPENSION',
      'DATA_CREATE',
      'DATA_UPDATE',
      'DATA_DELETE',
      'API_ACCESS'
    ],
    required: true
  },
  ip: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ ip: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
