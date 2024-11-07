const mongoose = require("mongoose");
const User = require("./User"); // Make sure the User model is imported
const Chapter = require("./Chapter"); // Import Chapter if it's defined separately
const Category = require("./Category"); // Import Category if defined

const novelSchema = new mongoose.Schema({
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
});

const Novel = mongoose.models.Novel || mongoose.model("Novel", novelSchema);

module.exports = Novel;
