import mongoose from "mongoose";

const DATABASE_URI = process.env.DATABASE_URI;
console.log("⏳ Connecting to MongoDB Atlas..."); // Yeh line add kareinnpm instal

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!DATABASE_URI) {
    throw new Error(
      "Please define the DATABASE_URI environment variable inside .env.local",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 30 seconds (بڑھایا)
      connectTimeoutMS: 15000, // بڑھایا
      socketTimeoutMS: 60000, // بڑھایا
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
      w: "majority" as const,
    };

    cached.promise = mongoose.connect(DATABASE_URI, opts)
      .then((mongoose) => {
        console.log("✓ MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("✗ MongoDB connection failed:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error("✗ MongoDB connection error:", errorMsg);
    
    // Helpful error messages
    if (errorMsg.includes("ETIMEOUT")) {
      console.error("⚠️ Network timeout - check your internet connection or MongoDB Atlas firewall");
    }
    if (errorMsg.includes("ENOTFOUND")) {
      console.error("⚠️ DNS resolution failed - check DATABASE_URI");
    }
    
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
