const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['PLATFORM_ADMIN', 'OPERATIONS_ADMIN', 'FACULTY', 'STUDENT', 'INDUSTRY_ADMIN'],
    default: 'STUDENT'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'LOCKED'],
    default: 'ACTIVE'
  },
  linkedEntity: {
    type: {
      type: String,
      enum: ['INSTITUTE', 'FACULTY', 'INDUSTRY', 'NONE'],
      default: 'NONE'
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'linkedEntity.type'
    }
  },
  lastLoginAt: {
    type: Date
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Remove passwordHash from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
