// models/Review.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Novel",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: { type: Date }, // Add this field
});

// Add a compound unique index to prevent multiple comments from same user on same novel
ReviewSchema.index({ user: 1, novel: 1 }, { unique: true });

module.exports =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);
