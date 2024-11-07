// utils/dbConnect.js
const mongoose = require("mongoose");

require("dotenv").config();

const MONGODB_URI = process.env.MongodbURL;

if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environment variable");
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false, retryWrites: true };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;
