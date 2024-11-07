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
      ref: "Rate", // One-to-One relation with Rate
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Many-to-One relation with Category
    },
    user_favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Many-to-Many relation with User
      },
    ],
    image_novel: {
      type: String, // Assuming you will store the file path or URL for the image
    },
    detail: {
      type: String,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
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
      // New field to store the average rating
      type: Number,
      default: 0,
    },
  }
  // { strictPopulate: false } // Options object as a separate argument
);

const Novel = mongoose.models.Novel || mongoose.model("Novel", novelSchema);

module.exports = Novel;
