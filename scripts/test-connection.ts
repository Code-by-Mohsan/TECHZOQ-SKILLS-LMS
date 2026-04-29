import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env" });

const DATABASE_URI = process.env.DATABASE_URI;

async function testConnection() {
  try {
    console.log("🔍 Testing MongoDB connection...");
    console.log("📍 Connection string:", DATABASE_URI?.substring(0, 50) + "...");

    if (!DATABASE_URI) {
      console.error("❌ DATABASE_URI not found in .env file");
      process.exit(1);
    }

    await mongoose.connect(DATABASE_URI);
    console.log("✅ Successfully connected to MongoDB!");

    const dbName = mongoose.connection.db?.getName();
    console.log("📊 Database name:", dbName);

    // List collections
    const collections = await mongoose.connection.db?.listCollections().toArray();
    console.log("📦 Collections:", collections?.map((c: any) => c.name).join(", ") || "None");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error: any) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
