const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
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
  chapterNumber: {
    type: Number,
    required: true,
    min: 1
  },
  chapterTitle: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

chapterSchema.index({ subjectId: 1, chapterNumber: 1 });
chapterSchema.index({ programId: 1 });
chapterSchema.index({ universityId: 1 });

module.exports = mongoose.model('Chapter', chapterSchema);
