/**
 * MongoDB Atlas Connectivity & Health Verification Script
 *
 * Verifies that MONGODB_URI strictly points to the dedicated "itt_lms" database,
 * pings the database, and lists only itt_lms collections and document counts.
 * Strictly adheres to secrets discipline: zero credentials logged.
 *
 * Usage: npx tsx scripts/check-db.ts
 */

import * as fs from "fs";
import * as path from "path";

// Attempt to load .env.local if running outside Next.js runtime
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const rawVal = trimmed.slice(eqIdx + 1).trim();
        const val = rawVal.replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvLocal();

import { connectToDatabase, redactMongoUri, ALLOWED_DB_NAME } from "../src/lib/db";

async function main() {
  console.log("================================================================================");
  console.log(" Institute of Trading Tricks LMS — Database Health & Cluster Isolation Check");
  console.log("================================================================================");

  const rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    console.log("\n[STATUS] MONGODB_URI is not set in environment or .env.local.");
    console.log("Please define MONGODB_URI in your .env.local file to check Atlas connectivity.");
    console.log("Format: mongodb://<ATLAS_USER>:<ATLAS_PASSWORD>@.../itt_lms?ssl=true...");
    process.exit(0);
  }

  console.log(`\n1. Target URI: ${redactMongoUri(rawUri)}`);
  console.log(`2. Required Database Namespace: ${ALLOWED_DB_NAME}`);

  try {
    const startTime = performance.now();
    console.log(`3. Connecting to database...`);
    const mongooseInstance = await connectToDatabase();
    const conn = mongooseInstance.connection;

    if (!conn.db) {
      throw new Error("Connected but database instance handle is null.");
    }

    // Ping itt_lms directly (no cluster-wide privileges required)
    console.log(`4. Executing ping on '${ALLOWED_DB_NAME}'...`);
    await conn.db.command({ ping: 1 });
    const latencyMs = Math.round(performance.now() - startTime);

    console.log(`   ✓ Ping successful! Round-trip latency: ${latencyMs}ms`);
    console.log(`   ✓ Active Database: ${conn.name}`);

    // Verify resolved DB name matches ALLOWED_DB_NAME
    if (conn.name !== ALLOWED_DB_NAME) {
      throw new Error(
        `CLUSTER ISOLATION BREACH: Connected database name '${conn.name}' does not match '${ALLOWED_DB_NAME}'!`
      );
    }

    // List collections strictly inside itt_lms
    console.log(`\n5. Inspecting '${ALLOWED_DB_NAME}' collections:`);
    const collections = await conn.db.listCollections().toArray();

    if (collections.length === 0) {
      console.log(`   (No collections found in '${ALLOWED_DB_NAME}'. It will be populated upon initial seed.)`);
    } else {
      console.log(`   Total collections: ${collections.length}`);
      console.log("   -------------------------------------------------------------");
      console.log("   Collection Name                      Documents");
      console.log("   -------------------------------------------------------------");

      for (const col of collections.sort((a, b) => a.name.localeCompare(b.name))) {
        const count = await conn.db.collection(col.name).countDocuments();
        const paddedName = col.name.padEnd(36, " ");
        console.log(`   ${paddedName} ${count.toLocaleString()}`);
      }
      console.log("   -------------------------------------------------------------");
    }

    console.log("\n================================================================================");
    console.log(" RESULT: SUCCESS — Target is isolated to 'itt_lms'. All security checks passed.");
    console.log("================================================================================\n");

    await mongooseInstance.disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error("\n================================================================================");
    console.error(" RESULT: FAILED — Connection or isolation error:");
    console.error(` ${err?.message || err}`);
    console.error("================================================================================\n");
    process.exit(1);
  }
}

main();
