import mongoose from "mongoose";

/**
 * Single source of truth for the LMS database name.
 * Any connection attempting to target a different database (e.g. shared cluster neighbor)
 * will be rejected immediately before any network socket is opened.
 */
export const ALLOWED_DB_NAME = "itt_lms";

/**
 * Extracts the database name from a standard or SRV MongoDB URI.
 * Safely handles replica set comma-separated hosts where WHATWG URL throws Invalid URL.
 */
export function parseMongoDbName(uri: string): string | null {
  if (!uri || typeof uri !== "string") return null;
  // MongoDB URI syntax: mongodb[+srv]://[user:pass@]host1[:port1][,...hostN[:portN]]/[database][?options]
  const match = uri.match(/^mongodb(?:\+srv)?:\/\/(?:[^@]+@)?(?:[^\/\?]+)\/([^?\/\s]+)/);
  if (!match || !match[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/**
 * Redacts username and password credentials from a MongoDB connection string
 * so it can be safely used in error messages, health diagnostics, or logs without secret leakage.
 */
export function redactMongoUri(uri: string): string {
  if (!uri || typeof uri !== "string") return "";
  return uri.replace(/^(mongodb(?:\+srv)?:\/\/)[^\/@]+@/, "$1***:***@");
}

/**
 * Strict database guard.
 * Asserts that the URI:
 * 1. Begins with mongodb:// or mongodb+srv://
 * 2. Explicitly targets ALLOWED_DB_NAME ("itt_lms")
 * Throws a fatal, secret-free error on any discrepancy to protect shared cluster databases.
 */
export function validateMongoUri(uri: string): void {
  if (!uri || typeof uri !== "string") {
    throw new Error(
      "[Database Guard] MONGODB_URI is undefined or empty. Define it in .env.local"
    );
  }

  const trimmed = uri.trim();
  if (!trimmed.startsWith("mongodb://") && !trimmed.startsWith("mongodb+srv://")) {
    throw new Error(
      "[Database Guard] Invalid MONGODB_URI protocol. Must begin with 'mongodb://' or 'mongodb+srv://'."
    );
  }

  const dbName = parseMongoDbName(trimmed);
  if (!dbName) {
    throw new Error(
      `[Database Guard] Missing database name in MONGODB_URI. Target database must be explicitly specified as '/${ALLOWED_DB_NAME}'. Received URI format: ${redactMongoUri(trimmed)}`
    );
  }

  if (dbName !== ALLOWED_DB_NAME) {
    throw new Error(
      `[Database Guard - CLUSTER SAFETY VIOLATION] Target database '${dbName}' is strictly FORBIDDEN. Only '${ALLOWED_DB_NAME}' is permitted on this cluster. Connection refused.`
    );
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache || { conn: null, promise: null };

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  // Enforce cluster safety database guard before attempting connection
  validateMongoUri(uri);

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
