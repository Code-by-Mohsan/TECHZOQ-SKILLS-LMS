import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

console.log("DATABASE_URI:", process.env.DATABASE_URI ? "✅ Loaded" : "❌ Not loaded");
console.log("Value preview:", process.env.DATABASE_URI?.substring(0, 60) + "...");
