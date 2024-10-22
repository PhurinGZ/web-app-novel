const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel' // Many-to-One relationship with Novel
  },
  content: {
    type: Array, // Assuming 'blocks' can be represented as an array
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
