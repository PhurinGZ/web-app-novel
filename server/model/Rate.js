const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  novels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel' // One-to-Many relation with Novel
  }],
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

const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;
