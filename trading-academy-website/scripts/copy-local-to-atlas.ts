/**
 * Safe Local-to-Atlas Database Migration Utility for "itt_lms"
 *
 * Copies collections from local "itt_lms" to MongoDB Atlas "itt_lms".
 *
 * SAFETY GUARDS:
 * 1. Hard-locked to "itt_lms" namespace only. Never touches any other database.
 * 2. Pre-flight check: Refuses to overwrite non-empty target without explicit --force flag.
 * 3. Dry-run support: Inspects and plans migration with --dry-run without writing any records.
 * 4. Post-copy audit: Compares source vs. target document counts per collection.
 * 5. Secrets discipline: All URIs are redacted in stdout/logs.
 *
 * Usage:
 *   npx tsx scripts/copy-local-to-atlas.ts --dry-run
 *   npx tsx scripts/copy-local-to-atlas.ts [--force]
 */

import * as fs from "fs";
import * as path from "path";
import mongoose from "mongoose";

// Attempt to load .env.local
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

import { validateMongoUri, redactMongoUri, ALLOWED_DB_NAME } from "../src/lib/db";

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isForce = args.includes("--force");

// Extract optional --source-uri and --target-uri args
let sourceUri = "mongodb://localhost:27017/itt_lms";
let targetUri = process.env.MONGODB_URI || "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--source-uri" && args[i + 1]) {
    sourceUri = args[i + 1];
  }
  if (args[i] === "--target-uri" && args[i + 1]) {
    targetUri = args[i + 1];
  }
}

async function copyData() {
  console.log("================================================================================");
  console.log(" Institute of Trading Tricks LMS — Safe Local-to-Atlas Data Copier");
  console.log("================================================================================");
  console.log(`Execution Mode: ${isDryRun ? "DRY-RUN (Simulated, No Writes)" : isForce ? "LIVE (Force Overwrite Permitted)" : "LIVE (Safe Mode)"}`);

  // Validate target URI presence
  if (!targetUri) {
    console.error("\n[ERROR] Target MONGODB_URI is not defined.");
    console.error("Please configure MONGODB_URI in .env.local or supply --target-uri <URI>.");
    process.exit(1);
  }

  // Enforce cluster isolation guard on BOTH source and target URIs
  console.log("\n[1/5] Verifying database isolation guard on connection strings...");
  try {
    validateMongoUri(sourceUri);
    validateMongoUri(targetUri);
  } catch (err: any) {
    console.error(`\n[FATAL GUARD REJECTION]: ${err.message}`);
    process.exit(1);
  }

  console.log(`  Source URI: ${redactMongoUri(sourceUri)} (DB: ${ALLOWED_DB_NAME})`);
  console.log(`  Target URI: ${redactMongoUri(targetUri)} (DB: ${ALLOWED_DB_NAME})`);

  if (sourceUri === targetUri) {
    console.error("\n[FATAL] Source and Target URIs resolve to the exact same endpoint. Aborting to prevent cycle.");
    process.exit(1);
  }

  // Connect to source and target
  console.log("\n[2/5] Establishing database connections...");
  const sourceConn = await mongoose.createConnection(sourceUri, {
    serverSelectionTimeoutMS: 5000,
  }).asPromise();
  console.log("  ✓ Source connected");

  const targetConn = await mongoose.createConnection(targetUri, {
    serverSelectionTimeoutMS: 5000,
  }).asPromise();
  console.log("  ✓ Target connected");

  try {
    const sourceDb = sourceConn.db;
    const targetDb = targetConn.db;

    if (!sourceDb || !targetDb) {
      throw new Error("Failed to acquire database instances.");
    }

    // Ping both
    await sourceDb.command({ ping: 1 });
    await targetDb.command({ ping: 1 });
    console.log("  ✓ Ping verified on both endpoints");

    // Inspect collections
    console.log("\n[3/5] Pre-flight inspection of collections in 'itt_lms'...");
    const sourceCollections = await sourceDb.listCollections().toArray();
    const targetCollections = await targetDb.listCollections().toArray();

    console.log(`  Found ${sourceCollections.length} collections in source 'itt_lms'.`);
    console.log(`  Found ${targetCollections.length} collections in target 'itt_lms'.`);

    // Check if target has existing data
    let targetHasData = false;
    const targetCounts: Record<string, number> = {};

    for (const col of targetCollections) {
      const c = await targetDb.collection(col.name).countDocuments();
      targetCounts[col.name] = c;
      if (c > 0) targetHasData = true;
    }

    if (targetHasData && !isDryRun && !isForce) {
      console.error("\n[PRE-FLIGHT ABORT] Target database 'itt_lms' already contains data:");
      for (const [colName, count] of Object.entries(targetCounts)) {
        if (count > 0) console.error(`  - ${colName}: ${count} document(s)`);
      }
      console.error("\nTo prevent accidental overwriting, this script refuses to copy to a non-empty target.");
      console.error("If this is intended, re-run with the '--force' flag, or verify first with '--dry-run'.");
      process.exit(1);
    }

    // Collection copy plan
    console.log("\n[4/5] Executing migration plan...");
    const auditSummary: Array<{
      collection: string;
      sourceCount: number;
      targetBefore: number;
      copied: number;
      targetAfter: number;
    }> = [];

    for (const colInfo of sourceCollections.sort((a, b) => a.name.localeCompare(b.name))) {
      const colName = colInfo.name;
      // Skip system collections if any
      if (colName.startsWith("system.")) continue;

      const sourceCol = sourceDb.collection(colName);
      const targetCol = targetDb.collection(colName);

      const srcCount = await sourceCol.countDocuments();
      const beforeCount = targetCounts[colName] || 0;

      if (isDryRun) {
        auditSummary.push({
          collection: colName,
          sourceCount: srcCount,
          targetBefore: beforeCount,
          copied: 0,
          targetAfter: beforeCount,
        });
        console.log(`  [DRY-RUN] ${colName.padEnd(30)} Source: ${srcCount} doc(s) -> Target would receive: ${srcCount} doc(s)`);
        continue;
      }

      console.log(`  Copying ${colName} (${srcCount} docs)...`);
      let copied = 0;

      if (srcCount > 0) {
        const cursor = sourceCol.find({});
        const batchSize = 250;
        let batch: any[] = [];

        while (await cursor.hasNext()) {
          const doc = await cursor.next();
          batch.push(doc);

          if (batch.length >= batchSize) {
            // Upsert each by _id so existing records are updated rather than throwing duplicate key errors
            const ops = batch.map((d) => ({
              replaceOne: {
                filter: { _id: d._id },
                replacement: d,
                upsert: true,
              },
            }));
            await targetCol.bulkWrite(ops, { ordered: false });
            copied += batch.length;
            batch = [];
          }
        }

        if (batch.length > 0) {
          const ops = batch.map((d) => ({
            replaceOne: {
              filter: { _id: d._id },
              replacement: d,
              upsert: true,
            },
          }));
          await targetCol.bulkWrite(ops, { ordered: false });
          copied += batch.length;
        }
      }

      const afterCount = await targetCol.countDocuments();
      auditSummary.push({
        collection: colName,
        sourceCount: srcCount,
        targetBefore: beforeCount,
        copied,
        targetAfter: afterCount,
      });
      console.log(`  ✓ ${colName} completed. (${afterCount} total in target)`);
    }

    // Post-copy verification table
    console.log("\n[5/5] Post-Copy Document Count Comparison:");
    console.log("--------------------------------------------------------------------------------");
    console.log("Collection Name                Source   Target Before   Copied   Target After");
    console.log("--------------------------------------------------------------------------------");
    for (const item of auditSummary) {
      const col = item.collection.padEnd(30, " ");
      const src = item.sourceCount.toString().padStart(6, " ");
      const before = item.targetBefore.toString().padStart(13, " ");
      const cpy = item.copied.toString().padStart(8, " ");
      const after = item.targetAfter.toString().padStart(12, " ");
      console.log(`${col} ${src} ${before} ${cpy} ${after}`);
    }
    console.log("--------------------------------------------------------------------------------");

    if (isDryRun) {
      console.log("\n[DRY-RUN COMPLETE] No writes were made to target Atlas cluster.");
    } else {
      console.log("\n[SUCCESS] Migration completed safely to 'itt_lms'.");
    }
    console.log("================================================================================\n");
  } finally {
    await sourceConn.close();
    await targetConn.close();
  }
}

copyData().catch((err) => {
  console.error("\n[FATAL ERROR IN MIGRATION SCRIPT]:", err);
  process.exit(1);
});
