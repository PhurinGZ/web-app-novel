import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "author", "admin"],
    default: "user",
  },
  bio: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String, // Store URL or file path for profile picture
    default: "",
  },
  novel_favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'Novel'
  }],  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if the model is already compiled to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
