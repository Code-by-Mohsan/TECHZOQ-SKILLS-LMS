import * as dotenv from "dotenv";
import * as dns from "dns";
import { promisify } from "util";
import mongoose from "mongoose";

dotenv.config({ path: ".env" });

const resolveTxt = promisify(dns.resolveTxt);
const dnsLookup = promisify(dns.lookup);

const DATABASE_URI = process.env.DATABASE_URI;

async function runDiagnostics() {
  console.log("\n🔍 MongoDB Atlas Connection Diagnostics\n");
  console.log("=".repeat(60));

  // Test 1: Check if DATABASE_URI is loaded
  console.log("\n1️⃣  Checking Environment Variable...");
  if (!DATABASE_URI) {
    console.error("❌ DATABASE_URI not found in .env file");
    process.exit(1);
  }
  console.log("✅ DATABASE_URI loaded");
  console.log(`   Value: ${DATABASE_URI.substring(0, 80)}...`);

  // Extract host from connection string
  const hostMatch = DATABASE_URI.match(
    /mongodb\+srv:\/\/[^:]+:[^@]+@([^/?]+)/
  );
  if (!hostMatch) {
    console.error("❌ Invalid connection string format");
    process.exit(1);
  }
  const host = hostMatch[1];
  console.log(`   Host: ${host}`);

  // Test 2: DNS lookup
  console.log("\n2️⃣  Testing DNS Resolution...");
  try {
    console.log(`   Attempting to resolve: ${host}`);
    const result = await dnsLookup(host);
    console.log(`✅ DNS resolved successfully`);
    console.log(`   IP Address: ${result.address}`);
    console.log(`   Family: IPv${result.family}`);
  } catch (error: any) {
    console.error(`❌ DNS lookup failed: ${error.code}`);
    console.log("   This usually means:");
    console.log("   - Your IP is not whitelisted in MongoDB Atlas");
    console.log("   - Your network is blocking DNS queries");
    console.log("   - MongoDB Atlas network access is not configured");
    console.log("\n   ⚡ FIX: Go to MongoDB Atlas → Network Access → Add IP Address");
  }

  // Test 3: TXT records (MongoDB Atlas uses these)
  console.log("\n3️⃣  Testing TXT Records (MongoDB SRV)...");
  try {
    const srvHost = `_mongodb._tcp.${host}`;
    console.log(`   Attempting TXT lookup on: _acme-challenge.${host}`);
    const txt = await resolveTxt(host);
    console.log(`✅ TXT records found`);
    txt.forEach((record) => {
      console.log(`   - ${record.join("")}`);
    });
  } catch (error: any) {
    console.error(`⚠️  TXT lookup issue (non-critical): ${error.code}`);
  }

  // Test 4: MongoDB Connection
  console.log("\n4️⃣  Testing MongoDB Connection...");
  try {
    console.log("   Connecting to MongoDB...");
    const startTime = Date.now();

    const connection = await mongoose.connect(DATABASE_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    const connectionTime = Date.now() - startTime;
    console.log(`✅ MongoDB connection successful in ${connectionTime}ms`);

    // Get database info
    const dbName = connection.connection.db?.getName();
    const adminDb = connection.connection.db?.admin();
    const serverStatus = await adminDb?.serverStatus();

    console.log(`   Database: ${dbName}`);
    console.log(`   Server Version: ${serverStatus?.version || "Unknown"}`);

    // List collections
    const collections = await connection.connection.db
      ?.listCollections()
      .toArray();
    console.log(
      `   Collections: ${collections?.map((c: any) => c.name).join(", ") || "None"}`
    );

    await mongoose.disconnect();
    console.log("   ✅ Disconnected successfully");
  } catch (error: any) {
    console.error(`❌ MongoDB connection failed`);
    console.error(`   Error: ${error.code || error.message}`);
    console.log("\n   Possible causes:");

    if (error.code === "ETIMEOUT" || error.code === "ECONNREFUSED") {
      console.log("   1. IP not whitelisted in MongoDB Atlas");
      console.log("   2. Network/Firewall blocking connection");
      console.log("   3. Cluster is not running or being deployed");
    } else if (error.code === "ERR_INVALID_ARG_TYPE") {
      console.log("   1. Invalid connection string format");
      console.log("   2. Missing username or password");
    } else if (
      error.message.includes("authentication failed") ||
      error.message.includes("401")
    ) {
      console.log("   1. Username or password is incorrect");
      console.log("   2. User doesn't have sufficient permissions");
    } else {
      console.log("   1. Check .env file is correct");
      console.log("   2. Verify MongoDB Atlas cluster is running");
      console.log("   3. Review MongoDB Atlas documentation");
    }
  }

  // Test 5: Connection String Analysis
  console.log("\n5️⃣  Connection String Analysis...");
  const parts = DATABASE_URI.match(
    /mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)/
  );
  if (parts) {
    const [, username, password, clusterHost] = parts;
    console.log(`   Protocol: mongodb+srv (SRV)`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password.substring(0, 5)}...${password.substring(password.length - 5)}`);
    console.log(`   Cluster Host: ${clusterHost}`);

    // Extract cluster name
    const clusterName = clusterHost.split(".")[0];
    console.log(`   Cluster Name: ${clusterName}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log(
    "\n📋 Summary: All systems checked. See results above for status.\n"
  );
}

runDiagnostics().catch((error) => {
  console.error("Diagnostic failed:", error);
  process.exit(1);
});
