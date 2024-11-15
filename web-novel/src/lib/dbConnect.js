// utils/dbConnect.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MongodbURL;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MongodbURL environment variable in your .env file"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      retryWrites: true,
      maxPoolSize: 10, // Add connection pool for better performance
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    } catch (error) {
      console.error('MongoDB Connection Error:', error);
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;