// models/Novel.js
const mongoose = require("mongoose");

const novelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
    rate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rate",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    // Updated fields for user interactions
    viewCount: {
      type: Number,
      default: 0
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    bookshelf: [{  // user_favorites renamed to bookshelf for clarity
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    }],
    image_novel: {
      type: String,
    },
    detail: {
      type: String,
    },
    type: {
      type: String,
      enum: ['novel', 'webtoon'],
      required: [true, 'กรุณาระบุประเภทนิยาย']
    },
    tags: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'dropped'],
      default: 'ongoing'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    publishedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  }
);

// Add indexes for better query performance
novelSchema.index({ viewCount: -1 });
novelSchema.index({ likes: 1 });
novelSchema.index({ bookshelf: 1 });

// Virtual for like count
novelSchema.virtual('likeCount').get(function() {
  return this.likes?.length || 0;
});

// Virtual for bookshelf count
novelSchema.virtual('bookshelfCount').get(function() {
  return this.bookshelf?.length || 0;
});

const Novel = mongoose.models.Novel || mongoose.model("Novel", novelSchema);

module.exports = Novel;