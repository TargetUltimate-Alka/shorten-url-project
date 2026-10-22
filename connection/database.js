const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("WARNING: MONGO_URI is not set. Database operations will not work until MONGO_URI is configured.");
    return;
  }

  try {
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

module.exports = connectDB;