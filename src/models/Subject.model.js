const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
}, { _id: false });

const subjectSchema = new mongoose.Schema({
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  academicYear: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  subjectName: {
    type: String,
    required: true,
    trim: true
  },
  subjectCode: {
    type: String,
    required: true,
    trim: true
  },
  recommendedBooks: {
    type: [bookSchema],
    default: []
  }
}, {
  timestamps: true
});

subjectSchema.index({ programId: 1, academicYear: 1 });
subjectSchema.index({ universityId: 1 });
subjectSchema.index({ subjectCode: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
