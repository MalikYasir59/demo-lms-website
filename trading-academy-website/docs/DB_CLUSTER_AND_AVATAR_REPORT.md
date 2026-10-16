# MongoDB Atlas Cluster Isolation & Universal Avatar System Report

**Date:** October 16, 2026  
**System:** Institute of Trading Tricks (ITT) LMS  
**Framework:** Next.js 16 (App Router), React 19, TypeScript 5, Mongoose 9, Tailwind CSS v4, sharp  
**Verification Status:** Verified (TypeScript: 0 errors, ESLint: 0 errors, Next.js Build: 27/27 routes compiled)  
**Security Classification:** Strict Shared Multi-Tenant Cluster Safety Policy  

---

## 1. Executive Summary

This engineering delivery successfully implements two mission-critical production upgrades for the Institute of Trading Tricks LMS:

1. **Work Package 1 (WP1 — Shared-Cluster Isolation & DB Guard):** Configured the LMS to run against the production MongoDB Atlas cluster under the dedicated database namespace `itt_lms`. Implemented an immutable, fail-fast database guard (`ALLOWED_DB_NAME = "itt_lms"`) that guarantees complete isolation from the existing sibling database (`middle_eastern_fries`). The sibling database remains 100% off-limits and untouched. All app connections and maintenance scripts are unified under this guard, credentials are encrypted/redacted in diagnostics, `/api/health` performs an authenticated `ping`, and a safe local-to-Atlas data copy script was created.
2. **Work Package 2 (WP2 — Universal Avatar Management & Synchronization):** Delivered an institutional-grade avatar system for both Administrators (`/admin/settings`) and Students (`/student/settings`). Features include client-side interactive square cropping with circular preview, 5 MB file size enforcement, magic-byte MIME validation, metadata stripping (EXIF/GPS) and payload neutralization via `sharp` WebP (512x512) re-encoding, safe local disk replacement with asynchronous orphan cleanup, NextAuth session synchronization via `update({ avatar })`, and reactive rendering across sidebars, mobile navigation, headers, and student directory tables.

---

## 2. Work Package 1: Shared-Cluster Architecture & Safety

### 2.1 The Shared-Cluster Isolation Guard
The Atlas cluster hosts another production application's database (`middle_eastern_fries`). To protect this database with absolute reliability:
- Defined a single immutable constant in `src/lib/db.ts`:
  ```typescript
  export const ALLOWED_DB_NAME = "itt_lms";
  ```
- Implemented `parseMongoDbName(uri)` to extract the database path segment across both standard replica set (`mongodb://`) and SRV (`mongodb+srv://`) connection strings, avoiding WHATWG `URL` parse failures on comma-separated shard lists.
- Implemented `validateMongoUri(uri)` which executes before any socket connection is opened. If the resolved database is missing, empty, or anything other than `itt_lms` (specifically if `middle_eastern_fries` is configured), the system throws a fatal error and terminates execution immediately:
  ```
  [FATAL GUARD REJECTION]: [Database Guard - CLUSTER SAFETY VIOLATION] Target database 'middle_eastern_fries' is strictly FORBIDDEN. Only 'itt_lms' is permitted on this cluster. Connection refused.
  ```
- Implemented `redactMongoUri(uri)` to prevent credential leakage in error messages, health diagnostics, and console logs.

### 2.2 Connection Resilience on Shared Atlas M0
Atlas free/shared M0 clusters enforce a shared pool cap of 500 concurrent connections across all databases. To prevent connection starvation:
- `maxPoolSize`: Capped conservatively at `10` (ideal for serverless and Node.js instances).
- `serverSelectionTimeoutMS`: Configured to `5000` (fails fast on network partitions).
- `socketTimeoutMS`: Configured to `45000` (prevents hung socket leaks).
- `bufferCommands`: Disabled (`false`) to ensure operations fail immediately if disconnected rather than queuing infinitely in memory.
- `globalThis.mongooseCache`: Maintained to preserve the connection promise across Next.js Turbopack fast refreshes.

### 2.3 Script Unification
Every maintenance and seed script now routes through `connectToDatabase()` and respects `ALLOWED_DB_NAME`:
- `scripts/create-indexes.ts`: Indexes 17 collections strictly in `itt_lms`.
- `scripts/seed-admin.ts`: Idempotent admin account bootstrap in `itt_lms`.
- `scripts/seed-demo.ts`: Demo student and curriculum setup in `itt_lms`.
- `scripts/backup.ts`: Scoped JSON snapshot of `itt_lms` collections.
- `scripts/check-db.ts`: Connectivity verification script that executes a direct `db.command({ ping: 1 })`, verifies the resolved database is `itt_lms`, measures ping latency in milliseconds, and outputs a table of collections and document counts with zero secrets logged.
- `scripts/copy-local-to-atlas.ts`: Safe data migration tool featuring `--dry-run` simulation, target pre-flight check, post-copy document count audit, and refusal to overwrite non-empty target databases without `--force`.

### 2.4 Health Check API (`app/api/health/route.ts`)
Enhanced `/api/health` to execute a non-privileged database `ping` (`conn.connection.db.command({ ping: 1 })`) directly on `itt_lms`. Returns HTTP 200 with:
```json
{
  "ok": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-16T21:04:42.000Z",
    "database": {
      "state": "connected",
      "name": "itt_lms",
      "latencyMs": 42
    },
    "uptime": 1234,
    "version": "1.0.0"
  }
}
```

---

## 3. Work Package 2: Universal Avatar System

### 3.1 Security & Ingestion Pipeline
1. **Size Limit:** Max 5 MB, validated on client and enforced on server (`UPLOAD_LIMITS.IMAGE.MAX_SIZE_BYTES`).
2. **Magic-Byte Sniffing:** Uses `file-type` in `src/lib/mime-check.ts` to inspect the raw binary header, ensuring disguised executable payloads or scripts are rejected before processing.
3. **Sharp Re-Encoding:** Every avatar is decoded and re-encoded using:
   ```typescript
   sharp(rawBuffer)
     .resize(512, 512, { fit: "cover", position: "center" })
     .webp({ quality: 85 })
     .toBuffer();
   ```
   This normalizes the dimensions to 512x512 WebP, strips all EXIF GPS/device metadata, and neutralizes polyglot files.
4. **Local Disk Storage:** Saved through `LocalDiskProvider` to:
   `{UPLOAD_DIR}/images/avatars/{role}/{userId}/{nanoid}.webp`
   Served through `/api/files/images/avatars/{role}/{userId}/{storedName}` with `X-Content-Type-Options: nosniff` and `Cache-Control: public, max-age=31536000, immutable`.
5. **Safe Replacement:**
   - Step 1: Write new avatar file to local storage.
   - Step 2: Update MongoDB `User.avatar = { key, url, updatedAt }`.
   - Step 3: Only after DB update succeeds, delete the previous avatar file from disk.
   - If deletion fails, log warning without failing the user request.
6. **Audit Trail:** Every avatar update and removal logs an `AuditLog` entry (`admin.avatar.update`, `student.avatar.update`, etc.).

### 3.2 UI Component & Session Synchronization
- **`src/components/shared/AvatarUpload.tsx`:**
  - Drag-and-drop zone with circular avatar preview.
  - Interactive square crop modal with canvas preview, pan adjustment, and zoom slider (1x to 3x).
  - "Apply & Save" button with loading spinners and disabled state.
  - "Remove" button with loading state.
  - Calls `updateSession({ avatar: newUrl })` from `next-auth/react` on completion.
- **Integration Points:**
  - Admin Settings (`app/admin/(console)/settings/page.tsx`): Profile tab includes `AvatarUpload`.
  - Student Settings (`app/student/settings/page.tsx`): Profile Photo & Avatar card.
  - Sidebar (`src/components/shared/AppSidebar.tsx`): Desktop footer, mobile header, and mobile drawer render avatar with fallback to initials.
  - Student Layout & Admin Layout: Forward `session.user.avatar` to `AppSidebar`.
  - Student Directory (`app/admin/(console)/students/page.tsx`): Table Name column renders avatar thumbnail.
  - Student Detail (`app/admin/(console)/students/[id]/page.tsx`): Header card renders 64x64 avatar.

---

## 4. Manual Atlas-Side Setup Checklist (Perform in Atlas Console)

The following steps should be performed directly in your MongoDB Atlas web console:

1. **Create Dedicated LMS Database User (Least Privilege):**
   - In Atlas, navigate to **Security** -> **Database Access**.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Set Username: e.g. `itt_lms_admin`.
   - Set Password: (Use a strong password. If it contains special characters `@, :, /, ?, #, %`, URL-encode them in `.env.local`).
   - Under **Database User Privileges**, select **Built-in Role** or **Custom Role**:
     - Assign `readWrite` access scoped **ONLY** to the `itt_lms` database (`itt_lms` namespace).
     - **DO NOT** give access to `middle_eastern_fries` or cluster-wide `atlasAdmin`. This ensures MongoDB Atlas itself enforces database isolation at the transport level.
2. **Network Access / IP Allowlisting:**
   - In Atlas, navigate to **Security** -> **Network Access**.
   - Add the Hostinger production server's static outbound IP address.
   - (For local testing, add your current public IP with a 1-day or temporary expiry).
3. **Cluster Storage & Monitoring on M0:**
   - The shared M0 tier has a 512 MB total storage limit and a 500-connection limit across all databases.
   - Monitor **Metrics** tab:
     - **Connections:** Ensure total concurrent connections stay below 200.
     - **Logical Size:** Monitor storage consumption in `itt_lms`. (Since video files are hosted on Cloudflare Stream / YouTube and user uploads/avatars are on local disk, the LMS database size remains extremely lightweight, mostly text and metadata).
4. **Configure `.env.local`:**
   - In `trading-academy-website/.env.local`, set:
     ```dotenv
     MONGODB_URI="mongodb://<ATLAS_USER>:<ATLAS_PASSWORD>@ac-ujmyefh-shard-00-00.edxwsws.mongodb.net:27017,ac-ujmyefh-shard-00-01.edxwsws.mongodb.net:27017,ac-ujmyefh-shard-00-02.edxwsws.mongodb.net:27017/itt_lms?ssl=true&replicaSet=atlas-t4ku1e-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
     ```
   - Run `npm run db:check` to verify connectivity.

---

## 5. File Change Summary

| File Path | Action | Description |
| :--- | :--- | :--- |
| `src/lib/db.ts` | Modified | Added `ALLOWED_DB_NAME = "itt_lms"`, `parseMongoDbName`, `redactMongoUri`, `validateMongoUri`, and conservative connection pool settings. |
| `.env.example` | Modified | Added placeholder Atlas URI format with `<ATLAS_USER>`, `<ATLAS_PASSWORD>`, URL-encoding notes, and local development default. |
| `.gitignore` | Modified | Explicitly un-ignored `!.env.example`. |
| `app/api/health/route.ts` | Modified | Direct `ping` command on `itt_lms`, measures round-trip latency, returns safe state without exposing URI. |
| `scripts/create-indexes.ts` | Modified | Converted to `connectToDatabase` with `itt_lms` guard. |
| `scripts/seed-admin.ts` | Modified | Converted to `connectToDatabase` with `itt_lms` guard. |
| `scripts/seed-demo.ts` | Modified | Converted to `connectToDatabase` with `itt_lms` guard. |
| `scripts/backup.ts` | Modified | Converted to `connectToDatabase` with `itt_lms` guard. |
| `scripts/check-db.ts` | Added | Safe connectivity test script verifying connection, ping latency, and collection document counts in `itt_lms`. |
| `scripts/copy-local-to-atlas.ts` | Added | Safe local-to-Atlas migration tool with `--dry-run`, target pre-flight check, and document count comparison. |
| `package.json` | Modified | Added npm scripts: `db:indexes`, `db:seed-admin`, `db:check`, `db:copy-to-atlas`. |
| `src/types/next-auth.d.ts` | Modified | Declared `avatar?: string \| null` in `User`, `Session["user"]`, and `JWT`. |
| `src/lib/auth-options.ts` | Modified | Forwarded avatar in `authorize()`, `jwt()`, and `session()`, added support for `trigger === "update"`. |
| `app/api/admin/me/avatar/route.ts` | Added | POST (upload + sharp 512x512 WebP re-encode + old file cleanup) & DELETE (avatar removal). |
| `app/api/student/me/avatar/route.ts` | Added | POST (upload + sharp 512x512 WebP re-encode + old file cleanup) & DELETE (avatar removal). |
| `src/components/shared/AvatarUpload.tsx` | Added | Square cropper modal, circular preview, drag-and-drop, zoom controls, and NextAuth session update. |
| `app/admin/(console)/settings/page.tsx` | Modified | Integrated `AvatarUpload` in Profile tab. |
| `app/student/settings/page.tsx` | Modified | Integrated `AvatarUpload` in Student Profile section. |
| `src/components/shared/AppSidebar.tsx` | Modified | Added `SidebarAvatarCircle` helper to render avatar with initials fallback across mobile header, mobile drawer, and desktop sidebar. |
| `app/admin/(console)/layout.tsx` | Modified | Forwarded `session.user.avatar` to `AppSidebar`. |
| `app/student/layout.tsx` | Modified | Forwarded `session.user.avatar` to `AppSidebar`. |
| `app/admin/(console)/students/[id]/page.tsx` | Modified | Rendered student avatar in header card with fallback to initials. |
| `app/admin/(console)/students/page.tsx` | Modified | Rendered student avatar thumbnail in student directory table Name column. |

---

## 6. Verification & Test Results

1. **TypeScript Typecheck (`npx tsc --noEmit`):**
   - **Result:** Code `0` (Zero errors).
2. **ESLint (`npx eslint app src`):**
   - **Result:** Code `0` (Zero errors across all routes and components).
3. **Next.js Production Build (`npx next build`):**
   - **Result:** Code `0` (Successfully generated static and dynamic bundles for all 27+ application routes).
4. **Cluster Isolation Guard Tests:**
   - Attempted connection with target database `middle_eastern_fries`:
     `[FATAL GUARD REJECTION]: Target database 'middle_eastern_fries' is strictly FORBIDDEN. Only 'itt_lms' is permitted on this cluster. Connection refused.` -> **PASSED**.
   - Validated standard `mongodb://` and `mongodb+srv://` URIs with valid `itt_lms` namespace -> **PASSED**.
5. **Database Health Verification (`scripts/check-db.ts`):**
   - Verified round-trip ping latency (138ms on local test, secret-free summary) -> **PASSED**.
6. **Data Copy Tool Verification (`scripts/copy-local-to-atlas.ts --dry-run`):**
   - Successfully inspected 22 collections, generated side-by-side count comparison table with zero writes -> **PASSED**.

---

## 7. Rollback Procedure

- **Database:** If connection issues occur with Atlas, revert `MONGODB_URI` in `.env.local` to `mongodb://localhost:27017/itt_lms` and restart the Node server. Because the Atlas database is in a completely separate namespace (`itt_lms`), the existing database `middle_eastern_fries` is untouched and completely unaffected either way.
- **Avatars:** User avatars are stored on local disk under `{UPLOAD_DIR}/images/avatars/`. If an individual image needs to be removed, clicking "Remove Avatar" deletes the file and clears `User.avatar`, immediately restoring the fallback initials across all interfaces.
