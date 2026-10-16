# Database Cluster Isolation & Avatar System Architecture Plan

**Document Version:** 1.0.0  
**Target Environment:** Production Next.js 16 (App Router), Node.js, MongoDB Atlas (Shared M0 Cluster)  
**Security Classification:** Highly Confidential — Shared Multi-Tenant Infrastructure Policy  

---

## 1. Executive Summary & Strategic Context

The "Institute of Trading Tricks" (ITT) LMS is expanding infrastructure onto a production MongoDB Atlas cluster that concurrently hosts an unrelated production database (`middle_eastern_fries`).

This engineering operation consists of two mission-critical work packages:
1. **Work Package 1 (WP1 — Shared-Cluster Isolation & DB Guard):** Safely mount the LMS database onto the existing Atlas cluster under the dedicated database namespace `itt_lms`. Absolute isolation must be guaranteed: the sibling database `middle_eastern_fries` is strictly off-limits and must never be read, written, listed, dropped, indexed, or accessed under any circumstances.
2. **Work Package 2 (WP2 — Universal Avatar Management & Synchronization):** Implement an institutional-grade avatar upload, re-encoding, and session synchronization pipeline for both Administrators (`/admin/settings`) and Students (`/student/settings`), with rendering synchronized across headers, sidebars, and student management views.

---

## 2. Phase 1 Findings & Architectural Baseline

### 2.1 Shared-Cluster Isolation Analysis
- **Current Connection Logic (`src/lib/db.ts`):** Mongoose connection establishes pooling without inspecting the resolved database name. If an engineer configured a connection string pointing to the wrong database or root without database path, writes could target unintended namespaces.
- **WHATWG URL Parser Incompatibility:** Standard `new URL()` throws `TypeError: Invalid URL` on standard MongoDB replica-set connection strings containing comma-separated shard hostnames (`mongodb://user:pass@host1:27017,host2:27017/itt_lms`). A robust, regex-based MongoDB URI parser and credential redactor is required.
- **Script Discrepancies:** Maintenance scripts (`scripts/create-indexes.ts`, `scripts/seed-admin.ts`, `scripts/seed-demo.ts`, `scripts/backup.ts`) each manually read `process.env.MONGODB_URI` with fallback `mongodb://localhost:27017/itt_lms` and call `mongoose.connect()` directly, bypassing `src/lib/db.ts`. All scripts must be unified under the strict `itt_lms` database guard.
- **Cluster Connection Budget (Atlas M0):** Free/shared M0 clusters cap total concurrent connections at 500 across all databases on the cluster. `maxPoolSize` must be kept conservative (5–10) with explicit `serverSelectionTimeoutMS: 5000` and `socketTimeoutMS: 45000` to prevent connection starvation for either application.

### 2.2 Avatar Upload & Storage Baseline
- **Storage Subsystem (`src/lib/storage.ts`):** The LMS already features a production `LocalDiskProvider` with traversal protection and public URL mapping (`/api/files/images/[...path]`). Avatars will reside under `{UPLOAD_DIR}/images/avatars/{role}/{userId}/{nanoid}.webp`.
- **Image Security & Hygiene:** Raw user uploads pose risks of malicious polyglot payloads and metadata leaks (EXIF GPS/device data). We will use `sharp` (already present in the project) to re-encode all uploaded avatars into normalized 512x512 WebP buffers with quality 85, stripping all EXIF metadata.
- **Safe Replacement & Cleanup:** When a user uploads a new avatar or removes their existing avatar, the database record is updated first. Once confirmed, the old disk file is safely unlinked. If the unlinking fails, the error is logged without failing the user request.
- **NextAuth Session Synchronization:** `src/lib/auth-options.ts` currently does not return `avatar` in `authorize()` or JWT/session callbacks, and does not handle `trigger === "update"`. We must update `src/types/next-auth.d.ts` and `authOptions` so calling `update({ avatar: newUrl })` from `@tanstack/react-query` or client forms immediately propagates to all UI consumers.

---

## 3. Work Package 1: Shared-Cluster Isolation Specification

### 3.1 Single Source of Truth & Database-Name Guard
We establish a single immutable constant:
```typescript
export const ALLOWED_DB_NAME = "itt_lms";
```

A dedicated URI parser and credential redactor function will be placed in `src/lib/db.ts`:
- `parseMongoDbName(uri: string): string | null`: Extracts the exact database path segment preceding query parameters.
- `redactMongoUri(uri: string): string`: Redacts `username:password` credentials, printing safe diagnostics like `mongodb://***:***@ac-ujmyefh-shard.../itt_lms`.
- `validateMongoUri(uri: string): void`: Asserts that `uri` begins with `mongodb://` or `mongodb+srv://`, and that `parseMongoDbName(uri) === ALLOWED_DB_NAME`. If the database name is missing, empty, or anything other than `itt_lms` (especially `middle_eastern_fries`), it throws a fatal `Error` preventing any socket connection.

### 3.2 Resilience & Connection Options
In `src/lib/db.ts`, Mongoose connection options:
```typescript
const opts: mongoose.ConnectOptions = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  autoIndex: false, // Prevents index building during hot reloads
};
```

### 3.3 Unified Script Architecture
The following scripts will be updated to import `connectToDatabase` and respect the guard:
1. `scripts/create-indexes.ts`: Only indexes collections inside `itt_lms`.
2. `scripts/seed-admin.ts`: Idempotent admin account bootstrap.
3. `scripts/seed-demo.ts`: Demo student and curriculum seeding.
4. `scripts/backup.ts`: Scoped strictly to `itt_lms` collections.
5. `scripts/check-db.ts` (NEW): Safe connectivity verification script that prints connection state, ping latency, and collection document counts for `itt_lms` only, with zero secrets logged.
6. `scripts/copy-local-to-atlas.ts` (NEW): Safe, non-destructive data migration script from local MongoDB to Atlas `itt_lms`, featuring `--dry-run`, collection verification, document counts comparison, and refusal to overwrite non-empty target collections without `--force`.

### 3.4 Health Check API Enhancement (`app/api/health/route.ts`)
The health endpoint will execute a direct database `ping` (`conn.connection.db.command({ ping: 1 })`), calculate latency in milliseconds, and return:
```json
{
  "ok": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-16T...",
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
Credentials and raw connection strings are never exposed.

---

## 4. Work Package 2: Universal Avatar Pipeline Specification

### 4.1 Security & Ingestion Pipeline
1. **Client-Side:**
   - File selection via standard input or drag-and-drop.
   - Client-side size validation (max 5 MB via `src/lib/upload-limits.ts`).
   - Allowed formats: JPEG, PNG, WebP.
   - Interactive canvas-based square cropping tool with circular preview.
2. **Server-Side API (`/api/admin/me/avatar` & `/api/student/me/avatar`):**
   - Role-based authentication via `withApi`.
   - Magic-byte MIME type validation using `file-type`.
   - Size limit verification (reject payloads > 5 MB with HTTP 413).
   - Re-encoding via `sharp(buffer).resize(512, 512, { fit: "cover" }).webp({ quality: 85 }).toBuffer()`.
   - Saves file to `{UPLOAD_DIR}/images/avatars/{role}/{userId}/{nanoid}.webp`.
   - Atomically updates `User.avatar = { key, url, updatedAt }`.
   - Safely removes the previous avatar file from disk if it existed.
   - Logs `AuditLog` entry for avatar change or removal.

### 4.2 NextAuth Token & Session Sync
1. `src/types/next-auth.d.ts`:
   - Declare `avatar?: string | null` in `User`, `Session["user"]`, and `JWT`.
2. `src/lib/auth-options.ts`:
   - On `authorize()`, return `avatar: user.avatar?.url || null`.
   - In `jwt()` callback, copy `user.avatar` to `token.avatar`.
   - Handle `trigger === "update"`: if `session?.avatar !== undefined`, update `token.avatar = session.avatar`.
   - In `session()` callback, pass `token.avatar` to `session.user.avatar`.
3. Client synchronization:
   - When upload completes, call `update({ avatar: result.url })` from `next-auth/react`.

### 4.3 UI Component Architecture
1. **`src/components/shared/AvatarUpload.tsx` (NEW):**
   - Reusable avatar management card with:
     - Circular avatar preview with fallback initials.
     - Drag-and-drop upload dropzone.
     - Client-side square crop modal using HTML5 canvas.
     - Uploading progress / loading spinner.
     - "Upload New Avatar" and "Remove Avatar" buttons.
     - Toast notifications via `sonner`.
2. **Integration into Settings Pages:**
   - `app/admin/(console)/settings/page.tsx` (Profile tab).
   - `app/student/settings/page.tsx` (Student Credentials / Profile section).
3. **Global Avatar Rendering Updates:**
   - `src/components/shared/AppSidebar.tsx`: Render avatar image with initials fallback.
   - `app/admin/(console)/layout.tsx` & `app/student/layout.tsx`: Forward `avatar: session?.user?.avatar` to sidebar.
   - `app/admin/(console)/students/[id]/page.tsx`: Display student avatar in header card.
   - `app/admin/(console)/students/page.tsx`: Display avatar thumbnail in student table rows.

---

## 5. File-by-File Change Plan

| File Path | Nature | Description |
| :--- | :--- | :--- |
| `src/lib/db.ts` | Edit | Add `ALLOWED_DB_NAME = "itt_lms"`, `parseMongoDbName()`, `redactMongoUri()`, `validateMongoUri()`, conservative connection pool settings. |
| `.env.example` | Edit | Document Atlas placeholder connection string format with `<ATLAS_USER>`, `<ATLAS_PASSWORD>`, alongside local default. |
| `.gitignore` | Edit | Ensure `!.env.example` is explicitly un-ignored. |
| `app/api/health/route.ts` | Edit | Add `conn.connection.db.command({ ping: 1 })`, report latency and database name `itt_lms`. |
| `scripts/create-indexes.ts` | Edit | Use `connectToDatabase` with `itt_lms` guard. |
| `scripts/seed-admin.ts` | Edit | Use `connectToDatabase` with `itt_lms` guard. |
| `scripts/seed-demo.ts` | Edit | Use `connectToDatabase` with `itt_lms` guard. |
| `scripts/backup.ts` | Edit | Use `connectToDatabase` with `itt_lms` guard. |
| `scripts/check-db.ts` | New | Safe connectivity test script that pings and counts `itt_lms` collections only. |
| `scripts/copy-local-to-atlas.ts` | New | Local to Atlas data copier with `--dry-run`, pre-flight target check, and `--force` guard. |
| `package.json` | Edit | Add scripts: `db:check`, `db:seed-admin`. |
| `src/types/next-auth.d.ts` | Edit | Add `avatar?: string \| null` to `User`, `Session["user"]`, and `JWT`. |
| `src/lib/auth-options.ts` | Edit | Populate avatar in `authorize()`, `jwt()`, and `session()`; support `trigger === "update"`. |
| `app/api/admin/me/avatar/route.ts` | New | POST (upload + sharp 512x512 WebP re-encode + old file cleanup) and DELETE (avatar removal). |
| `app/api/student/me/avatar/route.ts` | New | POST (upload + sharp 512x512 WebP re-encode + old file cleanup) and DELETE (avatar removal). |
| `src/components/shared/AvatarUpload.tsx` | New | Client-side crop, drag-and-drop, preview, upload, remove, and session sync component. |
| `app/admin/(console)/settings/page.tsx` | Edit | Embed `AvatarUpload` in Profile tab. |
| `app/student/settings/page.tsx` | Edit | Embed `AvatarUpload` in Student Profile section. |
| `src/components/shared/AppSidebar.tsx` | Edit | Accept and render user avatar in desktop and mobile views with fallback to initials. |
| `app/admin/(console)/layout.tsx` | Edit | Forward avatar from session to `AppSidebar`. |
| `app/student/layout.tsx` | Edit | Forward avatar from session to `AppSidebar`. |
| `app/admin/(console)/students/[id]/page.tsx` | Edit | Render student avatar in header with initial fallback. |
| `app/admin/(console)/students/page.tsx` | Edit | Render student avatar thumbnail in table rows with initial fallback. |

---

## 6. Risk Analysis & Mitigation Strategies

| Risk | Likelihood | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Accidental connection to `middle_eastern_fries`** | Low | Critical | `validateMongoUri()` fails fast and throws an exception before establishing any socket connection if database != `itt_lms`. |
| **Connection pool exhaustion on shared M0** | Medium | High | Restrict `maxPoolSize: 10`, configure `serverSelectionTimeoutMS: 5000`, reuse cached global connection promise. |
| **Credential leak in logs or error messages** | Low | Critical | Strict redaction regex applied to all connection logging and error messages. Zero credentials in stdout/stderr. |
| **User avatar upload failure leaves missing avatar** | Low | Medium | Multi-step pipeline: write new avatar file first -> update MongoDB record -> unlink old avatar file only after DB save succeeds. |
| **Polyglot / malicious image file upload** | Low | High | Enforce `file-type` magic bytes verification, plus unconditional `sharp` decode and WebP re-encode to sanitize raw bytes. |

---

## 7. Rollback Plan

1. **Database Rollback:** If Atlas connectivity or permission issues arise, change `MONGODB_URI` in `.env.local` back to `mongodb://localhost:27017/itt_lms`. Restart the Node application. Because no schemas were modified destructively and `itt_lms` is entirely separate, the sibling database `middle_eastern_fries` remains 100% unaffected.
2. **Avatar Rollback:** Avatars are stored on local disk under `{UPLOAD_DIR}/images/avatars/`. If an issue occurs with an uploaded image, clearing `User.avatar = null` or deleting the file restores the fallback initials seamlessly.

---

## 8. Verification & Test Checklist

- [ ] `tsc --noEmit` passes with 0 errors.
- [ ] Next.js production build (`npm run build`) passes with 0 errors.
- [ ] Database guard rejects URI with wrong database name (e.g. `middle_eastern_fries` or blank DB).
- [ ] Database guard accepts valid `itt_lms` URI.
- [ ] `/api/health` returns status `200` with `database.name === "itt_lms"` and latency.
- [ ] `scripts/check-db.ts` executes safely without logging secrets.
- [ ] Avatar upload works for Admin (`/admin/settings`) with instant session and sidebar update.
- [ ] Avatar upload works for Student (`/student/settings`) with instant session and sidebar update.
- [ ] Old avatar file is purged from disk upon replacement or deletion.
- [ ] Avatars render properly in Student Directory table and Student Detail page.
