const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }],
  rate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rate' // One-to-One relation with Rate
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category' // Many-to-One relation with Category
  },
  user_favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Many-to-Many relation with User
  }],
  image_novel: {
    type: String // Assuming you will store the file path or URL for the image
  },
  detail:{
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

const Novel = mongoose.models.Novel || mongoose.model('Novel', novelSchema);

module.exports = Novel;
