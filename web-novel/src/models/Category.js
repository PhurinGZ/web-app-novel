//category model
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  novels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel' // Reference to Novel model
  }],
  nameThai: {
    type: String
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

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

module.exports = Category;
