const mongoose = require('mongoose');

const listNovelSchema = new mongoose.Schema({
  nameListEN: {
    type: String,
    required: true
  },
  novels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel' // Reference to Novel model
  }],
  nameListTH: {
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

const ListNovel = mongoose.model('ListNovel', listNovelSchema);

module.exports = ListNovel;
