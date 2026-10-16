**S A R A N G V E N T U R E S** 

**T E C H N I C A L S P E C I F I C A T I O N** 

# **Learning Management System (LMS)** 

Architecture, Database, Backend API, Secure Video Delivery and Frontend Plan 

|**Prepared for**|Institute of Trading Tricks|
|---|---|
|**Prepared by**|Sarang Ventures|
|**Document version**|1.0 - Draft for review|
|**Date**|13 October 2026|
|**Based on**|LMS Financial Proposal dated 4 September 2026 and the admin/student requirements<br>brief|
|**Technology**|Next.js (App Router) | MongoDB Atlas | NextAuth.js | YouTube (unlisted) | Hostinger<br>Node.js|
|**Classification**|Confidential - contains security design details. Do not share outside the project team.|



LMS Technical Specification  |  Institute of Trading Tricks 

## **Document Map** 

This specification is organised so that each audience can jump to what they need: the client can read Sections 1, 2 and 14; developers will spend most time in Sections 3 to 9. 

|**#**|**Section**|**What it covers**|
|---|---|---|
|**1**|Executive summary|Goals, key decisions, honest security expectations, scope delta against the signed<br>proposal|
|**2**|Roles and modules|Permission matrix, the 5 admin modules and 4 student modules|
|**3**|System architecture|Stack, layers, folder structure, URL map, Hostinger constraints, environment|
|**4**|Database design|All MongoDB collections with fields, indexes, relationships, sample schemas|
|**5**|Authentication and sessions|NextAuth setup, guards, middleware, single-device policy, credential handling|
|**6**|Backend API specification|Every /api route, payloads, error codes, business rules|
|**7**|Secure video delivery|Threat model, ticket flow, player hardening, canvas watermark, devtools guard,<br>detection, response|
|**8**|Frontend plan|Design system, layouts, detailed page specifications for admin and student|
|**9**|Analytics specification|Metrics, formulas, rollups and charts|
|**10**|Non-functional requirements|Performance, scalability on M0, observability, backup, privacy|
|**11**|Testing and QA|Test levels and the security test checklist|
|**12**|Deployment and operations|Hostinger steps, cron jobs, release checklist|
|**13**|Implementation roadmap|Phases, effort, deliverables, acceptance|
|**14**|Risks and open decisions|Risk register and questions the client must answer|
|**A**|Appendix|Go-live security checklist|



Confidential  -  Sarang Ventures 

Page 1 

LMS Technical Specification  |  Institute of Trading Tricks 

## **1. Executive Summary** 

### **1.1 Purpose** 

This document is the complete technical blueprint for the custom LMS described in the signed proposal. It converts the requirements brief into a buildable design: database schema, Next.js backend structure under <mark>/api</mark> , a security architecture for protecting YouTube-hosted lectures, and a professional frontend plan for the admin console and the student portal. 

### **1.2 Goals** 

- **Admin-controlled platform.** No public sign-up. The admin creates students, sets their login credentials, assigns courses and controls access. 

- **Professional admin console** with five modules: Dashboard, Student Management, Course Management (Course > Module > Lecture), Analytics and Settings. 

- **Focused student portal** with four areas: Dashboard, Enrolled Courses (with course detail), a secure Lecture Viewer, and Settings (no password change). 

- **Layered content protection.** Only authorised, enrolled, single-device students can start playback; casual copying is blocked or very inconvenient; every leak is traceable to a student. 

- **Runs on the existing stack.** Next.js, MongoDB Atlas, NextAuth.js, Hostinger Node.js, with unlisted YouTube videos and no paid infrastructure required at launch. 

### **1.3 Key decisions at a glance** 

|**Area**|**Decision**|**Rationale**|
|---|---|---|
|**Framework**|Next.js App Router + TypeScript; route groups for<br>public, admin, student|Matches the existing website; server components<br>for fast first paint; one codebase and deployment|
|**Database**|MongoDB Atlas via Mongoose; separate collections<br>for Course, Module, Lecture|Free M0 tier at launch; separate collections allow<br>drag-drop reordering and scale without huge<br>documents|
|**Accounts**|Single<br>userscollection with<br>role(admin | student)|Simplifies NextAuth; student-only fields live under<br>profile|
|**Auth**|NextAuth Credentials, JWT cookie + DB-backed<br>session id(<br>sid)|JWT keeps middleware fast; the<br>sidcheck allows<br>instant revocation and single-device enforcement|
|**Enrollment**|Admin-granted only, with start date and optional<br>expiry; no free/paid model|Per brief: no free/paid option and no Stripe in this<br>build|
|**Video storage**|Unlisted YouTube video; ID encrypted at rest<br>(AES-256-GCM)|Admin pastes a normal link; the ID never appears<br>in lists, HTML or admin screens|
|**Video delivery**|Short-lived one-time playback ticket, then redeem,<br>then hardened player|Server decides on every play whether the student<br>may watch|
|**Player**|YouTube IFrame API with all YouTube UI removed;<br>custom control bar; canvas watermark|Students never see YouTube controls, titles or links|
|**Rate limits and jobs**|MongoDB TTL collections; Hostinger cron calls<br>/api/cron/*|Hostinger shared Node hosting has no Redis or<br>background workers|
|**Analytics**|Live queries for recent data plus nightly rollups into<br>daily_stats|Keeps dashboards fast on the M0 free tier|



Confidential  -  Sarang Ventures 

Page 2 

LMS Technical Specification  |  Institute of Trading Tricks 

### **1.4 Security reality check** 

##### **Please read: what is and is not technically possible** 

No web technology can stop a determined person from recording what appears on their own screen, and no website can prevent a browser from opening developer tools. The requirements “devtools must never open” and “nobody can copy the link” therefore cannot be guaranteed in an absolute sense. 

This design instead delivers three achievable outcomes: **(1) Hard, server-enforced access control** - only an enrolled, active, single-device student can ever obtain a playable stream; **(2) Strong deterrents** - no visible links, no YouTube UI, blocked shortcuts and right-click, devtools detection with immediate lock-out; **(3) Forensic accountability** - a moving watermark with the student's name, email and phone plus a full audit trail, so any leaked recording points to one account, which can be locked and the video rotated. 

Section 7 documents each control honestly, including its residual risk. If lectures become high-value, Section 7.14 describes a low-effort upgrade path to a DRM-capable video host. 

### **1.5 Assumptions** 

- The existing website uses the Next.js App Router with TypeScript. If it uses the Pages Router, the same route handlers map to <mark>pages/api</mark> with minor changes. 

- Single institute (single tenant). Students are created by the admin; there is no self-registration. 

- Launch scale of roughly 1,000 students and up to about 100 concurrent viewers (to be confirmed by the client). 

- Supported browsers: latest two versions of Chrome, Edge, Firefox and Safari on desktop; Chrome and Safari on Android and iOS. 

- Times are stored in UTC and displayed in Asia/Karachi. UI language is English; strings are kept in a constants file so Urdu can be added later. 

### **1.6 Scope alignment with the signed proposal** 

The requirements brief is larger than the PKR 100,000 / 6-week scope in the proposal. The proposal itself states that scope changes are quoted separately, so the table below is the basis for a change request. 

|**Item**|**In signed proposal**|**In this specification**|**Impact**|
|---|---|---|---|
|**Public marketing site**|Yes|Integrated as<br>(public)route group|None|
|**Email/password auth**|Yes|Plus device sessions, lock-out, rate limits|Small|
|**Admin: courses, lessons,**<br>**students**|Yes|Extended: modules, categories, authors, rich student<br>profile, status, scheduling, drip|Medium|
|**Enrollment active/expired**|Yes|Plus access duration, content drip, bulk enroll|Small|
|**Secure video endpoint**|Yes|Tickets, hardened player, canvas watermark, devtools<br>guard, behaviour detection|Large|
|**Student dashboard and**<br>**progress**|Yes|Plus continue-learning, resume, unique-watch<br>tracking|Medium|
|**Analytics**|Not listed|Student, course, engagement and security analytics<br>with rollups and exports|Large|
|**Settings and avatar**|Not listed|Admin and student settings|Small|
|**Stripe payments**|Mentioned as optional|Excluded (no free/paid)|None|
|**Timeline**|6 weeks stated (table<br>lists 3)|About 10 weeks for one developer, about 6 for two<br>(Section 13)|Change<br>request|



Confidential  -  Sarang Ventures 

Page 3 

LMS Technical Specification  |  Institute of Trading Tricks 

## **2. Roles, Permissions and Modules** 

### **2.1 Permission matrix** 

|**Capability**|**Admin**|**Student**|**Public**|
|---|---|---|---|
|**View marketing website**|Yes|Yes|Yes|
|**Create / edit / suspend students, set credentials**|Yes|No|No|
|**Create / edit courses, modules, lectures, categories,**<br>**authors**|Yes|No|No|
|**Enroll students, extend or revoke access**|Yes|No|No|
|**View analytics and security events**|Yes|Own progress only|No|
|**Change own password**|Yes (current password<br>required)|No - admin resets it|No|
|**Edit own profile info and avatar**|Yes|Limited fields (see 8.4.5)|No|
|**Watch lectures**|Preview only<br>(watermarked)|Only enrolled, active,<br>unlocked lectures|No|



### **2.2 Admin modules** 

The brief says three admin pages but lists five; this specification covers all five. 

|**Module**|**Key capabilities**|
|---|---|
|**1. Dashboard**|KPI cards, trend charts, expiring enrollments, security alerts, at-risk students, quick actions|
|**2. Student Management**|CRUD for name, email, phone, address and other profile data; login credentials; status;<br>enrollments; sessions and devices; security events; bulk actions; CSV import/export|
|**3. Course Management**|Multiple courses; Course > Modules > Lectures; video link per lecture; selectable and quick-create<br>categories and authors; scheduling; drip; drag-and-drop ordering; duplicate; publish checks; no<br>free/paid option|
|**4. Analytics**|Per-student, per-course and platform analytics: progress, watch time, completion, drop-off,<br>engagement, retention, security|
|**5. Settings**|Profile and avatar, password change, active sessions, optional platform security configuration|



### **2.3 Student modules** 

|**Module**|**Key capabilities**|
|---|---|
|**1. Dashboard**|Stats, overall progress, “Continue where you left off” direct link, course cards, access-expiry<br>reminders|
|**2. Enrolled Courses**|Course list; per-course detail showing all modules and lectures with status and locks|
|**3. View Course (secure**<br>**viewer)**|The protected player: no devtools, no visible link, no YouTube controls, custom controls only,<br>moving name/email/phone watermark, behaviour monitoring|
|**4. Settings**|View info and edit allowed fields, change avatar. No password change (admin only)|



Confidential  -  Sarang Ventures 

Page 4 

LMS Technical Specification  |  Institute of Trading Tricks 

## **3. System Architecture** 

### **3.1 Technology stack** 

|**Layer**|**Technology**|**Notes**|
|---|---|---|
|**Framework**|Next.js (App Router), React, TypeScript|Pin current stable versions at project start|
|**UI**|Tailwind CSS + shadcn/ui (Radix), lucide-react<br>icons|Accessible primitives, consistent design tokens|
|**Forms and validation**|React Hook Form + Zod|Same Zod schemas are imported by client forms and<br>API handlers|
|**Data fetching**|Server components + TanStack Query|RSC for first paint; Query for tables, filters,<br>mutations|
|**Tables / charts / DnD**|TanStack Table, Recharts, dnd-kit|Server-side pagination; accessible drag handles|
|**Rich text**|Tiptap|Course description; sanitised on save|
|**Database**|MongoDB Atlas, Mongoose|M0 at launch; cached connection helper|
|**Auth**|NextAuth (Credentials),<br>jose,<br>bcryptjs|bcryptjsis pure JS and safe on Hostinger|
|**Security libs**|isomorphic-dompurify,<br>ua-parser-js, Node<br>crypto|Sanitise HTML, parse devices, AES-GCM|
|**Images**|sharp(fallback: browser-side resize)|Avatars and thumbnails; check Hostinger support|
|**Video**|YouTube IFrame Player API|Unlisted videos; behind a<br>VideoProvider<br>abstraction|
|**Testing**|Vitest, Playwright, mongodb-memory-server|Unit, integration, end-to-end|
|**Logging**|pino (JSON); optional Sentry|Never log tokens, passwords or video IDs|



### **3.2 Runtime architecture** 

<mark>Browser (Student / Admin) |  HTTPS (TLS, HSTS) v Hostinger Node.js  -  Next.js server |-- middleware.ts ........ role gate, security headers, CSP |-- app/(public) ......... existing marketing website |-- app/admin ............ admin console (RSC + client islands) |-- app/student .......... student portal + secure viewer '-- app/api/** ........... Route Handlers |  withApi(): auth + rate limit + Zod validation v services/  (business rules)  -->  models/ (Mongoose)  -->  MongoDB Atlas Browser --(IFrame API, UI hidden)--> YouTube   (video bytes stream directly from Google) Hostinger cron --(secret header)--> /api/cron/*  (expire enrollments, rollups, cleanup)</mark> 

Every API route follows the same pipeline: **Route Handler > `withApi` wrapper (session, role, rate limit, Zod) > service function (business rules, authorisation by ownership) > Mongoose model** . Handlers stay thin; rules live in services so they can be unit-tested without HTTP. 

### **3.3 Project folder structure** 

<mark>src/ app/ (public)/                         existing marketing site (auth)/login/page.tsx             student login  (admin: /admin/login) admin/ login/page.tsx</mark> 

Confidential  -  Sarang Ventures 

Page 5 

LMS Technical Specification  |  Institute of Trading Tricks 

<mark>(console)/layout.tsx            sidebar + topbar shell (console)/dashboard/page.tsx (console)/students/page.tsx | new/page.tsx | [id]/page.tsx (console)/courses/page.tsx  | new/page.tsx | [id]/page.tsx   (course builder) (console)/analytics/page.tsx (console)/settings/page.tsx student/ (portal)/layout.tsx             student shell (portal)/dashboard/page.tsx (portal)/courses/page.tsx | [courseId]/page.tsx (portal)/settings/page.tsx learn/[courseId]/[lectureId]/page.tsx   secure viewer (focus layout) api/ auth/[...nextauth]/route.ts admin/**   student/**   public/**   cron/**   health/route.ts components/  ui/  admin/  student/  player/  charts/  shared/ lib/         db.ts  auth.ts  guards.ts  api.ts  crypto.ts  youtube.ts  tickets.ts rate-limit.ts  security-score.ts  storage.ts  validators/ models/      User Category Author Course Module Lecture Enrollment LectureProgress AuthSession PlaybackTicket PlaybackSession SecurityEvent AuditLog Setting RateLimit DailyStat LectureStat services/    student  course  enrollment  playback  progress  analytics  security security/    devtools-guard  input-guard  watermark-engine  tamper-monitor player-shell.tsx  yt-loader.ts          (client-only, dynamic import) middleware.ts scripts/       seed-admin.ts  create-indexes.ts  backup.ts tests/         unit/  integration/  e2e/</mark> 

### **3.4 URL map** 

|**URL**|**Role**|**Page**|
|---|---|---|
|**/login**|Student|Student sign-in|
|**/admin/login**|Admin|Admin sign-in|
|**/admin/dashboard**|Admin|KPIs, trends, alerts|
|**/admin/students, /new, /[id]**|Admin|List, create, student detail with tabs|
|**/admin/courses, /new, /[id]**|Admin|List, create, course builder (details, curriculum, settings,<br>students, preview)|
|**/admin/analytics**|Admin|Overview, students, courses, engagement, security|
|**/admin/settings**|Admin|Profile, security, sessions, platform|
|**/student/dashboard**|Student|Stats, progress, continue link|
|**/student/courses, /[courseId]**|Student|Enrolled courses; course curriculum|
|**/student/learn/[courseId]/[lectureId]**|Student|Secure lecture viewer|
|**/student/settings**|Student|Profile info and avatar|



### **3.5 Hostinger and Atlas constraints** 

|**Constraint**|**Implication**|**Mitigation in this design**|
|---|---|---|
|**No Redis or long-running**<br>**workers**|No in-memory rate limiter or job<br>queue that survives restarts|Rate limits, tickets and sessions in MongoDB with TTL<br>indexes; cron endpoints for jobs|
|**Limited CPU/RAM on shared**<br>**Node hosting**|Heavy image work and big queries<br>can exhaust memory|Cached DB connection,<br>lean()queries, pagination,<br>rollups, resize images in browser if<br>sharpfails|
|**Filesystem may be replaced**<br>**on redeploy**|Uploaded avatars/thumbnails could<br>vanish|Store uploads in a persistent directory outside the<br>app folder(<br>UPLOAD_DIR) or use Cloudinary via<br>StorageProvider|



Confidential  -  Sarang Ventures 

Page 6 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Constraint**|**Implication**|**Mitigation in this design**|
|---|---|---|
|**Atlas M0: 512 MB, shared, no**<br>**automated backups**|Data loss risk and throughput caps|Index everything, rollups, scheduled export script,<br>upgrade to a paid tier before real student data is<br>stored at scale|
|**Dynamic outbound IP**|Atlas IP allow-list may block the app|Allow 0.0.0.0/0 with a strong DB password and TLS,<br>or ask Hostinger for a fixed IP|
|**WebSockets not guaranteed**|No push channel to kill a session<br>instantly|15-second heartbeat polling; server replies with<br>terminateinstructions|
|**Cron resolution is coarse**|Cannot run per-minute housekeeping|Enforce rules lazily on read; cron only for daily jobs|



### **3.6 Environment variables** 

|**Variable**|**Purpose**|
|---|---|
|**MONGODB_URI**|Atlas connection string (least-privilege DB user)|
|**NEXTAUTH_URL / APP_ORIGIN**|Public site origin; used for Origin checks and YouTube<br>originparameter|
|**NEXTAUTH_SECRET**|NextAuth JWT secret (32+ random bytes)|
|**VIDEO_ENC_KEY**|Base64 32-byte AES-256-GCM key for video references|
|**TICKET_SECRET**|HMAC secret for playback tickets (separate from NextAuth)|
|**CRON_SECRET**|Shared secret for<br>/api/cron/*|
|**UPLOAD_DIR / CLOUDINARY_URL**|Persistent storage for images and resources|
|**YT_API_KEY (optional)**|YouTube Data API key to auto-read durations|
|**SMTP_* (optional)**|Sending credential emails|



##### **Key management** 

Losing <mark>VIDEO_ENC_KEY</mark> makes every stored video link unreadable. Back it up offline separately from the database, and never commit it. Rotating it requires a one-off re-encryption script (included in <mark>scripts/</mark> ). 

Confidential  -  Sarang Ventures 

Page 7 

LMS Technical Specification  |  Institute of Trading Tricks 

## **4. Database Design (MongoDB)** 

### **4.1 Conventions** 

- Mongoose with TypeScript interfaces. <mark>_id</mark> is ObjectId; every collection has <mark>createdAt</mark> / <mark>updatedAt</mark> (Mongoose timestamps). 

- **Soft delete** <mark>(deletedAt</mark> ) for users, courses, modules and lectures so progress and analytics history survive. Hard delete only for drafts with no dependants. 

- Secrets and sensitive fields use <mark>select: false (passwordHash</mark> , <mark>video.ref</mark> ) and must be requested explicitly. 

- All times are UTC. Order fields <mark>(order</mark> ) are integers rewritten in bulk on reorder. 

- Denormalised counters <mark>(stats</mark> , <mark>progress</mark> ) are updated by the service layer and reconciled nightly by the rollup job. 

- Queries on lists use <mark>lean()</mark> , projections and cursor/offset pagination capped at 100 rows. 

- Multi-document transactions only where truly required (reorder); verify transaction support on the chosen Atlas tier first. 

### **4.2 Relationships** 

|**From**|**Relationship**|**To**|
|---|---|---|
|**Course**|many-to-many|Category (<br>categoryIds[])|
|**Course**|many-to-one|Author(<br>authorId)|
|**Course**|one-to-many|Module(<br>courseId)|
|**Module**|one-to-many|Lecture(<br>moduleId, also<br>courseIdfor fast queries)|
|**User (student)**|many-to-many via Enrollment|Course|
|**User + Lecture**|one-to-one via LectureProgress|Per-student, per-lecture progress|
|**User**|one-to-many|AuthSession, PlaybackSession, SecurityEvent|
|**Admin (User)**|one-to-many|AuditLog entries(<br>actorId)|



### **4.3 Collections** 

#### **4.3.1 users (admins and students)** 

|**Field**|**Type**|**Notes**|
|---|---|---|
|role|'admin' | 'student'|Indexed; drives all authorisation|
|studentCode|string|Unique, sparse. Human ID such as ITT-26-0001; also used in the<br>forensic watermark|
|name|string|Required; shown in watermark, so students cannot edit it|
|email|string|Lower-cased, unique; login identifier; shown in watermark|
|phone|string|E.164 (default +92); shown in watermark; admin-managed|
|passwordHash|string|bcrypt cost 12,<br>select:false. Never returned by any endpoint|
|passwordUpdatedAt|Date|Used to invalidate older sessions|
|status|'active' | 'inactive' |<br>'suspended'|Checked on every authenticated request|



Confidential  -  Sarang Ventures 

Page 8 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Field**|**Type**|**Notes**|
|---|---|---|
|avatar|{ key, url, updatedAt }|Stored via StorageProvider|
|profile.dob / gender /<br>idNumber|Date / string / string|Optional personal data; restricted to admin views|
|profile.address|{ line1, line2, city,<br>state, country,<br>postalCode }|Student can edit (8.4.5)|
|profile.education /<br>occupation|string|Optional|
|profile.experienceLevel|'beginner' |<br>'intermediate' |<br>'advanced'|Useful segmentation for a trading institute|
|profile.emergencyContact|{ name, phone,<br>relation }|Optional|
|profile.source / tags[]|string / string[]|How the student found the institute; admin tags|
|adminNotes|string|Admin-only; excluded from every student endpoint|
|security|{ failedLogins,<br>lockedUntil, strikes,<br>securityLocked,<br>lockReason,<br>lastStrikeAt }|Login lock-out and anti-piracy lock state|
|acceptedTermsAt|Date|Student accepts content-protection terms on first login|
|lastLoginAt / lastLoginIp /<br>loginCount|Date / string / number|Analytics and security|
|createdBy, deletedAt|ObjectId, Date|Audit and soft delete|



**Indexes:** <mark>{email:1}</mark> unique; <mark>{studentCode:1}</mark> unique sparse; <mark>{role:1,status:1,createdAt:-1}</mark> ; text index on <mark>name, email, phone, studentCode</mark> ; <mark>{deletedAt:1}</mark> . 

#### **4.3.2 categories and authors** 

|**Field**|**Type**|**Notes**|
|---|---|---|
|categories.name / slug|string|Unique (case-insensitive collation). Created inline from the course form|
|categories.description,<br>color, order|string, string, number|Colour used for badges and charts|
|categories.courseCount|number|Denormalised; deletion blocked while > 0 (409 with reassign option)|
|authors.name / slug|string|Authors are instructor profiles, independent of user accounts|
|authors.title, bio, avatar|string, string, object|Displayed on course pages|
|authors.social|{ website, linkedin,<br>youtube, x }|Optional|
|authors.isActive,<br>courseCount|boolean, number|Inactive authors hidden from the select box|



#### **4.3.3 courses** 

|**Field**|**Type**|**Notes**|
|---|---|---|
|title / slug|string|Slug auto-generated, editable, unique|



Confidential  -  Sarang Ventures 

Page 9 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Field**<br>subtitle / description|**Type**<br>string / HTML|**Notes**<br>Description is sanitised (DOMPurify) on save|
|---|---|---|
|thumbnail|{ key, url }|16:9 featured image|
|introVideoUrl|string (optional)|Public marketing preview only; not protected|
|categoryIds[] / authorId /<br>tags[]|ObjectId[] / ObjectId /<br>string[]|Selectable with quick-create|
|difficulty|'beginner' |<br>'intermediate' |<br>'advanced' | 'all'|From the reference UI (Difficulty Level)|
|language|string|Default English|
|status|'draft' | 'published' |<br>'archived'|Publish requires readiness checks (6.5)|
|publishAt / publishedAt|Date|Scheduled publishing|
|showOnPublicSite|boolean|Controls listing on the marketing site; access still needs enrollment|
|learningOutcomes[],<br>requirements[], audience[]|string[]|Course detail content|
|settings.drip|{ mode:<br>'none'|'sequential'|'da<br>ysAfterEnroll'|'fixedDa<br>te' }|Content drip rules|
|settings.accessDays|number | null|Default access length from enrollment; null = lifetime|
|settings.maxStudents|number | null|Enrollment cap|
|settings.completionThreshol<br>d|number (default 90)|Percent of unique seconds watched to mark a lecture complete|
|settings.allowSeekAhead|boolean|If false, students cannot seek beyond the furthest watched point|
|settings.allowedRates|number[]|Allowed playback speeds|
|stats|{ moduleCount,<br>lectureCount,<br>totalDurationSec,<br>enrolledCount }|Denormalised|
|order, createdBy, deletedAt|number, ObjectId,<br>Date|Manual ordering, audit, soft delete|



**Indexes:** <mark>{slug:1}</mark> unique; <mark>{status:1,publishAt:1}</mark> ; <mark>{categoryIds:1}</mark> ; <mark>{authorId:1}</mark> ; text index on <mark>title, tags</mark> . 

#### **4.3.4 modules and lectures** 

|**Field**|**Type**|**Notes**|
|---|---|---|
|modules.courseId / title /<br>description|ObjectId / string /<br>string||
|modules.order|number|Index<br>{courseId:1, order:1}|
|modules.status|'draft' | 'published'|Draft modules hidden from students|
|modules.drip|{ unlockAfterDays,<br>unlockAt }|Optional module-level unlock|
|modules.stats|{ lectureCount,<br>durationSec }|Denormalised|



Confidential  -  Sarang Ventures 

Page 10 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Field**|**Type**|**Notes**|
|---|---|---|
|lectures.courseId /<br>moduleId|ObjectId|Both stored so course-wide queries avoid joins|
|lectures.title / description /<br>order / type|string / string /<br>number / 'video'|Type enum leaves room for text and quiz lectures later|
|lectures.status|'draft' | 'published'||
|lectures.video.provider|'youtube'|Provider abstraction (7.14)|
|lectures.video.ref|{ enc, iv, tag }|AES-256-GCM ciphertext of the video ID;<br>select:false|
|lectures.video.hmac|string|HMAC-SHA256 of the ID; detects duplicate videos without decrypting|
|lectures.video.durationSec|number|Captured from admin preview or YouTube Data API|
|lectures.video.sourceTitle,<br>verifiedAt, version|string, Date, number|Title from oEmbed; version increments on replacement|
|lectures.resources[]|{ title, fileKey, mime,<br>size }|PDF/ZIP attachments served only through an authenticated route|
|lectures.drip|{ unlockAfterDays }|Used by<br>daysAfterEnrollmode|



**Indexes:** <mark>lectures: {moduleId:1,order:1}</mark> , <mark>{courseId:1}</mark> , <mark>{'video.hmac':1}</mark> . 

#### **4.3.5 enrollments** 

|**Field**|**Type**|**Notes**|
|---|---|---|
|studentId / courseId|ObjectId|Unique together|
|status|'active' | 'expired' |<br>'suspended' |<br>'revoked'|Stored status, kept in sync by cron and checked lazily|
|startsAt / expiresAt|Date / Date | null|null = lifetime|
|source / grantedBy / note|'admin'|'import' /<br>ObjectId / string|Audit|
|progress|{ completedLectures,<br>totalLectures, percent,<br>lastLectureId,<br>lastActivityAt }|Denormalised for fast dashboards and the Continue link|
|completedAt / revokedAt /<br>revokeReason|Date / Date / string||



**Effective access** = <mark>status === 'active'</mark> AND <mark>startsAt <= now</mark> AND <mark>(expiresAt</mark> is null OR <mark>expiresAt > now</mark> ). **Indexes:** <mark>{studentId:1,courseId:1}</mark> unique; <mark>{courseId:1,status:1}</mark> ; <mark>{status:1,expiresAt:1}</mark> ; <mark>{studentId:1,status:1}</mark> . 

#### **4.3.6 lecture_progress** 

|**Field**|**Type**|**Notes**|
|---|---|---|
|studentId / courseId /|ObjectId|Unique on<br>{studentId, lectureId}|
|moduleId / lectureId|||
|status|'in_progress' |<br>'completed'|Completed when unique watched percent reaches the course<br>threshold|
|lastPositionSec|number|Resume point|



Confidential  -  Sarang Ventures 

Page 11 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Field**|**Type**|**Notes**|
|---|---|---|
|durationSec|number|Snapshot of video length when progress was recorded|
|watchedRanges|[[start, end], ...]|Merged intervals of genuinely watched seconds|
|uniqueWatchedSec /<br>percent|number|Derived from<br>watchedRanges|
|totalWatchSec / playCount|number|Including re-watches; used by analytics|
|firstWatchedAt /<br>lastWatchedAt /<br>completedAt|Date||



**Indexes:** <mark>{studentId:1,lectureId:1}</mark> unique; <mark>{studentId:1,courseId:1}</mark> ; <mark>{courseId:1,lectureId:1,status:1}</mark> ; <mark>{lastWatchedAt:-1}</mark> . 

#### **4.3.7 Security and session collections** 

|**Collection**|**Key fields**|**Indexes / retention**|
|---|---|---|
|**auth_sessions**|sid, userId, deviceId, deviceLabel, ip, ua, createdAt, lastSeenAt,<br>expiresAt, revokedAt, revokedReason (replaced | admin |<br>logout | security | password_reset)|{sid:1}unique;<br>{userId:1,revokedAt:1}; TTL on<br>expiresAt|
|**playback_tickets**|jti, userId, sid, lectureId, ipHash, uaHash, usedAt, expiresAt|{jti:1}unique; TTL on<br>expiresAt<br>(about 2 minutes)|
|**playback_sessions**|userId, courseId, lectureId, sid, deviceId, ip, startedAt,<br>lastHeartbeatAt, endedAt, endReason, watchedSec, maxRate,<br>startPos, endPos, anomalies|{userId:1,startedAt:-1};<br>{userId:1,endedAt:1,lastHeartbeat<br>At:-1};<br>{lectureId:1,startedAt:-1};<br>TTL 180 days|
|**security_events**|userId, sid, type, severity (info | warn | high | critical), score,<br>lectureId, courseId, ip, ua, meta, resolved {by, at, note}|{userId:1,createdAt:-1};<br>{type:1,createdAt:-1};<br>{severity:1,'resolved.at':1}; TTL 365<br>days|
|**audit_logs**|actorId, action, entityType, entityId, summary, diff {before,<br>after} (sensitive fields redacted), ip|{entityType:1,entityId:1,createdAt:<br>-1};<br>{actorId:1,createdAt:-1}|
|**rate_limits**|key, count, windowStart, expiresAt|{key:1}unique; TTL on<br>expiresAt|
|**settings**|key ('platform'), value {security, defaults, site}, updatedBy|{key:1}unique|



#### **4.3.8 Analytics collections** 

|**Collection**|**Key fields**|**Purpose**|
|---|---|---|
|**daily_stats**|date (UTC day), scope ('platform' | 'course' | 'student' |<br>'lecture'), refId, metrics {...}|Nightly rollups; unique on<br>{date,<br>scope, refId}|
|**lecture_stats**|lectureId (unique), courseId, viewers, completions,<br>avgWatchPct, dropoffPct, heat[] (watch count per 10-second<br>bucket)|Drop-off curves and re-watch<br>heatmaps per lecture|



### **4.4 Sample Mongoose schemas** 

###### **Lecture model** 

<mark>// models/Lecture.ts const LectureSchema = new Schema({ courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true }, moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true }, title: { type: String, required: true, trim: true, maxlength: 160 },</mark> 

Confidential  -  Sarang Ventures 

Page 12 

LMS Technical Specification  |  Institute of Trading Tricks 

<mark>description: { type: String, maxlength: 5000 }, order: { type: Number, required: true }, type: { type: String, enum: ["video"], default: "video" }, status: { type: String, enum: ["draft", "published"], default: "draft" }, video: { provider: { type: String, enum: ["youtube"], default: "youtube" }, ref: { type: { enc: String, iv: String, tag: String, _id: false }, select: false }, hmac: { type: String, index: true }, durationSec: Number, sourceTitle: String, verif</mark> i <mark>edAt: Date, version: { type: Number, default: 1 }, }, resources: [{ title: String, f</mark> i <mark>leKey: String, mime: String, size: Number }], drip: { unlockAfterDays: { type: Number, default: null } }, deletedAt: { type: Date, default: null }, }, { timestamps: true }); LectureSchema.index({ moduleId: 1, order: 1 });</mark> 

###### **Effective access rule** 

<mark>// services/enrollment.service.ts export function hasAccess(e: { status: string; startsAt: Date; expiresAt?: Date | null }, now = new Date()) { return e.status === "active" && e.startsAt <= now && (!e.expiresAt || e.expiresAt > now); }</mark> 

### **4.5 Data lifecycle and retention** 

|**Data**|**Retention**|**Notes**|
|---|---|---|
|**Auth sessions**|Until<br>expiresAt(TTL)|Revoked rows kept 30 days for investigations|
|**Playback tickets**|2 minutes (TTL)|One-time use|
|**Playback sessions**|180 days|Aggregated into<br>daily_statsbefore expiry|
|**Security events**|365 days|Critical events exported with the student record when<br>locked|
|**Audit logs**|Indefinite|Small volume; admin actions only|
|**Students deleted by admin**|Soft-deleted; purge on request|Anonymise personal fields when a deletion request is<br>honoured, keep aggregate progress|



Confidential  -  Sarang Ventures 

Page 13 

LMS Technical Specification  |  Institute of Trading Tricks 

## **5. Authentication, Authorization and Sessions** 

### **5.1 Principles** 

- Accounts are provisioned by the admin only. There is no registration route and no self-service password reset or change for students. 

- Authentication is enforced **three times** : coarse role gate in <mark>middleware.ts</mark> , a <mark>requireAdmin()</mark> / <mark>requireStudent()</mark> guard in every handler and server component, and ownership checks inside services (a student can only touch their own records). 

- The JWT carries <mark>role</mark> and <mark>sid</mark> . The <mark>sid</mark> is checked against <mark>auth_sessions</mark> on every protected request, so revoking a session takes effect immediately. 

- Responses to failed logins are generic (“Invalid email or password”) and take similar time whether or not the account exists (dummy bcrypt compare). 

### **5.2 Login flow** 

1. Browser posts email, password and a random <mark>deviceId</mark> (stored in localStorage) to NextAuth Credentials. 

2. <mark>authorize()</mark> applies rate limits (5 attempts per 15 minutes per IP+email), loads the user, verifies bcrypt, and checks <mark>status</mark> , <mark>lockedUntil</mark> and <mark>securityLocked</mark> . 

3. On success it creates an <mark>auth_sessions</mark> row. For students, any previous active session is revoked <mark>(revokedReason: replaced</mark> ) so only one device is active; admins may have up to three. 

4. NextAuth issues an HttpOnly, Secure, SameSite=Lax cookie holding <mark>{ sub, role, sid }</mark> with a 12-hour absolute lifetime. 

5. The old device discovers it was replaced on its next heartbeat or API call (maximum 15 seconds while watching) and is signed out with the message “Signed in on another device”. 

### **5.3 NextAuth configuration** 

<mark>// lib/auth.ts export const authOptions: NextAuthOptions = { session: { strategy: "jwt", maxAge: 60 * 60 * 12 }, pages: { signIn: "/login" }, providers: [Credentials({ credentials: { email: {}, password: {}, deviceId: {} }, async authorize(c, req) { const ip = getIp(req); await rateLimit("login:" + ip + ":" + c?.email?.toLowerCase(), 5, 15 * 60); const u = await User.f</mark> i <mark>ndOne({ email: c!.email.toLowerCase(), deletedAt: null }) .select("+passwordHash"); const ok = await bcrypt.compare(c!.password, u?.passwordHash ?? DUMMY_HASH); if (!u || !ok) { await recordFailure(u, ip); return null; } if (u.status !== "active") throw new Error("ACCOUNT_" + u.status.toUpperCase()); if (u.security.securityLocked) throw new Error("ACCOUNT_SECURITY_LOCKED"); const sid = await createAuthSession(u, { ip, ua: getUA(req), deviceId: c!.deviceId }); return { id: String(u._id), name: u.name, role: u.role, sid }; }, })], callbacks: { jwt({ token, user }) { if (user) { token.role = user.role; token.sid = user.sid; } return token; }, session({ session, token }) { session.user.id = token.sub!; session.user.role = token.role; session.sid = token.sid; return session; }, }, };</mark> 

Confidential  -  Sarang Ventures 

Page 14 

LMS Technical Specification  |  Institute of Trading Tricks 

### **5.4 Guards** 

<mark>// lib/guards.ts export async function requireStudent() { const s = await getServerSession(authOptions); if (!s || s.user.role !== "student") throw new ApiError("AUTH_REQUIRED", 401); const sess = await AuthSession.f</mark> i <mark>ndOne({ sid: s.sid, userId: s.user.id, revokedAt: null, expiresAt: { $gt: new Date() }, }); if (!sess) throw new ApiError("SESSION_REPLACED", 401); const user = await User.f</mark> i <mark>ndById(s.user.id).select("name email phone studentCode status security"); if (!user || user.status !== "active" || user.security.securityLocked) throw new ApiError("ACCOUNT_INACTIVE", 403); AuthSession.updateOne({ _id: sess._id }, { lastSeenAt: new Date() }).catch(() => {}); return { user, sid: s.sid }; }</mark> 

<mark>// requireAdmin(): same, with role === "admin" and no securityLocked check</mark> 

### **5.5 Middleware** 

Middleware runs on the Edge runtime where Mongoose is unavailable, so it only reads the JWT. Databasebacked session checks stay in the guards above. 

<mark>// middleware.ts export async function middleware(req: NextRequest) { const token = await getToken({ req }); const p = req.nextUrl.pathname; const isAdminArea = p.startsWith("/admin") && p !== "/admin/login"; const isStudentArea = p.startsWith("/student"); if (isAdminArea && token?.role !== "admin") return NextResponse.redirect(new URL("/admin/login", req.url)); if (isStudentArea && token?.role !== "student") return NextResponse.redirect(new URL("/login", req.url)); const res = NextResponse.next(); applySecurityHeaders(res, req);       // see 7.11 return res; } export const conf</mark> i <mark>g = { matcher: ["/admin/:path*", "/student/:path*", "/api/admin/:path*", "/api/student/:path*"] };</mark> 

### **5.6 Credential handling** 

- **Create:** admin enters email and either types a password or clicks Generate (16 characters, random). The plaintext is shown once in a copy dialog together with a ready-to-send message template, then only the bcrypt hash is stored. 

- **View:** passwords can never be displayed again because they are hashed. The admin can only **Reset** (generate a new one), which also revokes all of the student's sessions. 

- **Students cannot change passwords.** There is no such route, and the settings page shows identity fields as read-only with “Contact your administrator”. 

- **Admin password change** (Settings) needs the current password, minimum 12 characters, a strength meter, and revokes the admin's other sessions. 

- **First admin** is created with <mark>npm run seed:admin</mark> ; there is no web route that can create an admin. 

### **5.7 Session and lock-out policy** 

|**Rule**|**Default**|**Configurable**|
|---|---|---|
|**Concurrent devices**|Students 1, admins 3|Settings > Platform|
|**Absolute session lifetime**|12 hours|Yes|
|**Idle timeout (no heartbeat or API call)**|2 hours|Yes|
|**Failed login lock-out**|5 failures: 15-minute lock, doubling on repeats|Yes|
|**Device ID**|Random UUID in localStorage + cookie; soft binding only|No|



Confidential  -  Sarang Ventures 

Page 15 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Rule**|**Default**|**Configurable**|
|---|---|---|
|**Cookies**|HttpOnly, Secure, SameSite=Lax,<br>__Secure-prefix|No|
|**CSRF**|NextAuth built-in on auth routes; mutating<br>/apicalls<br>require JSON content type, matching<br>Origin, and<br>SameSite cookies|No|
|**Security lock**|Set automatically at strike threshold; only an admin can<br>clear it|Thresholds yes|



Confidential  -  Sarang Ventures 

Page 16 

LMS Technical Specification  |  Institute of Trading Tricks 

## **6. Backend API Specification** 

### **6.1 Conventions** 

- All routes are Next.js Route Handlers under <mark>src/app/api</mark> . JSON only. Dates are ISO-8601 strings; ids are strings. 

- **Success:** <mark>{ ok: true, data }</mark> . **Failure:** <mark>{ ok: false, error: { code, message, details? } }</mark> with the matching HTTP status. 

- Lists accept <mark>page</mark> , <mark>limit</mark> (max 100), <mark>sort</mark> , q and filters, and return <mark>{ items, page, limit, total }</mark> . 

- All <mark>/api/student/**</mark> and <mark>/api/admin/**</mark> responses send <mark>Cache-Control: no-store</mark> . 

- Every body and query is validated with Zod; unknown keys are stripped. Mongo operators in input are rejected (no $ keys). 

#### **Standard error codes** 

|**Code**|**HTTP**|**Meaning**|
|---|---|---|
|**AUTH_REQUIRED**|401|No valid session|
|**SESSION_REPLACED**|401|Another device signed in or an admin revoked this session|
|**FORBIDDEN**|403|Role not allowed|
|**ACCOUNT_INACTIVE**|403|Student inactive, suspended or security-locked|
|**NOT_ENROLLED**|403|No enrollment for this course|
|**ENROLLMENT_EXPIRED**|403|Enrollment expired, suspended or revoked|
|**LECTURE_LOCKED**|403|Drip rule not yet satisfied;<br>details.unlockAtprovided|
|**DEVICE_LIMIT / STREAM_ACTIVE**|409|Another playback stream is active for this student|
|**TICKET_INVALID**|400|Ticket expired, reused or issued to another device|
|**VALIDATION_ERROR**|422|Zod validation failed; field errors in<br>details|
|**NOT_FOUND**|404|Missing or not owned by the caller (never reveals which)|
|**CONFLICT**|409|Duplicate email, slug or category in use|
|**RATE_LIMITED**|429|Too many requests;<br>Retry-Afterheader set|
|**SECURITY_LOCKED**|423|Account locked by the anti-piracy system|



### **6.2 The withApi wrapper** 

<mark>// lib/api.ts export const withApi = <T extends ZodTypeAny>( opts: { role?: "admin" | "student"; schema?: T; limit?: [key: string, max: number, windowSec: number] }, handler: (ctx: { req: Request; body: z.infer<T>; auth: Auth; params: any }) => Promise<unknown>, ) => async (req: Request, { params }: any) => { try { assertSameOrigin(req);                                   // Origin check on mutations const auth = opts.role === "admin" ? await requireAdmin() : opts.role === "student" ? await requireStudent() : null; if (opts.limit) await rateLimit(opts.limit[0] + ":" + (auth?.user._id ?? getIp(req)), opts.limit[1], opts.limit[2]); const body = opts.schema ? opts.schema.parse(await readJson(req)) : undef</mark> i <mark>ned; const data = await handler({ req, body, auth, params }); return json({ ok: true, data }); } catch (e) { return toErrorResponse(e); }                 // ApiError | ZodError | unknown (logged, generic 500) };</mark> 

Confidential  -  Sarang Ventures 

Page 17 

LMS Technical Specification  |  Institute of Trading Tricks 

### **6.3 Admin endpoints** 

#### **Dashboard and analytics** 

|**Metho**<br>**d**|**Endpoint**|**Purpose**|**Notes**|
|---|---|---|---|
|GET|/api/admin/dashboard|KPIs, trends, expiring<br>enrollments, alerts|Range param; cached 60 s|
|GET|/api/admin/analytics/overview|Platform analytics|from,<br>to,<br>courseId,<br>categoryId|
|GET|/api/admin/analytics/students|Student leaderboard and at-risk<br>list|Filters and pagination|
|GET|/api/admin/analytics/students/[id]|Single student analytics||
|GET|/api/admin/analytics/courses|Course comparison table||
|GET|/api/admin/analytics/courses/[id]|Funnel, drop-off, heatmaps,<br>cohorts||
|GET|/api/admin/analytics/engagement|DAU/WAU/MAU, watch hours,<br>peak-time heatmap||
|GET|/api/admin/analytics/security|Events by type, flagged students||
|GET|/api/admin/analytics/export|CSV export|type,<br>format=csv|



#### **Students and enrollments** 

|**Metho**<br>**d**|**Endpoint**|**Purpose**|**Notes**|
|---|---|---|---|
|GET /<br>POST|/api/admin/students|List with filters; create student|Create returns generated<br>password once|
|GET /<br>PATCH<br>|/api/admin/students/[id]|Read, update, soft-delete|Audit-logged|
|/<br>DELETE||||
|PATCH|/api/admin/students/[id]/status|Activate, deactivate, suspend|Suspending revokes sessions|
|POST|/api/admin/students/[id]/password|Reset or set password|Revokes all sessions|
|GET /<br>DELETE|/api/admin/students/[id]/sessions|List devices; force logout||
|GET /<br>POST|/api/admin/students/[id]/enrollments|List; enroll in one or more courses|Start date, expiry or access days|
|GET|/api/admin/students/[id]/progress|Per-course, per-lecture progress||
|GET|/api/admin/students/[id]/security-events|Event timeline and strike score||
|POST|/api/admin/students/[id]/security/unlock|Clear security lock and reset<br>strikes|Requires note|
|POST|/api/admin/students/bulk|Bulk status change, enroll, delete|Max 500 ids|
|POST|/api/admin/students/import|CSV import with row-level<br>validation report|Dry-run option|
|GET|/api/admin/students/export|CSV export of current filter|Excludes password data|



Confidential  -  Sarang Ventures 

Page 18 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Metho**<br>**d**|**Endpoint**|**Purpose**|**Notes**|
|---|---|---|---|
|PATCH<br>/|/api/admin/enrollments/[id]|Extend, change status, revoke||
|<br>DELETE||||
|POST|/api/admin/courses/[id]/enroll|Bulk enroll students into a course||



#### **Courses, modules, lectures, taxonomy** 

|**Metho**<br>**d**|**Endpoint**|**Purpose**|**Notes**|
|---|---|---|---|
|GET /<br>POST|/api/admin/courses|List with filters; create|Filters: status, category, author,<br>difficulty|
|GET /<br>PATCH<br>/|/api/admin/courses/[id]|Read, update, delete|Delete only drafts with no<br>enrollments; else archive|
|<br>DELETE||||
|PATCH|/api/admin/courses/[id]/status|Publish, unpublish, archive,<br>schedule|Runs readiness checks|
|POST|/api/admin/courses/[id]/duplicate|Deep copy of course, modules,<br>lectures|Copies video refs, not progress|
|GET|/api/admin/courses/[id]/curriculum|Full module and lecture tree|Video refs never returned|
|GET|/api/admin/courses/[id]/students|Enrolled students with progress||
|POST|/api/admin/courses/[id]/modules|Create module||
|PATCH<br>/<br>DELETE|/api/admin/modules/[id]|Update, delete||
|POST|/api/admin/modules/reorder|Reorder modules in a course|Body: ordered id list|
|POST|/api/admin/modules/[id]/lectures|Create lecture; accepts batch of<br>links||
|PATCH<br>/|/api/admin/lectures/[id]|Update, delete||
|<br>DELETE||||
|POST|/api/admin/lectures/reorder|Reorder and move between<br>modules|Single transaction|
|POST|/api/admin/lectures/[id]/duplicate|Duplicate a lecture||
|POST|/api/admin/video/validate|Parse and verify a YouTube link<br>(oEmbed)|Returns title and thumbnail, never<br>the ID|
|PUT|/api/admin/lectures/[id]/video|Set or replace the video link|Encrypts; increments<br>video.version|
|POST|/api/admin/lectures/[id]/preview-ticket|Admin preview via the same<br>secure player|Watermarked “ADMIN PREVIEW”|
|POST /<br>DELETE|/api/admin/lectures/[id]/resources|Upload or remove attachments|Type and size validated|



Confidential  -  Sarang Ventures 

Page 19 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Metho**<br>**d**|**Endpoint**|**Purpose**|**Notes**|
|---|---|---|---|
|GET /|/api/admin/categories, /authors|CRUD with inline quick-create|Delete blocked if in use|
|POST /||||
|PATCH<br>/||||
|<br>DELETE||||



#### **Settings and uploads** 

|**Metho**<br>**d**|**Endpoint**|**Purpose**|**Notes**|
|---|---|---|---|
|GET /<br>PATCH|/api/admin/me|Own profile||
|POST|/api/admin/me/avatar|Upload avatar|JPEG/PNG/WebP up to 2 MB|
|POST|/api/admin/me/password|Change password|Current password required|
|GET /<br>DELETE|/api/admin/me/sessions|List and revoke own sessions||
|GET /<br>PATCH|/api/admin/settings/platform|Security thresholds, defaults,<br>watermark tuning|Audit-logged|
|POST|/api/admin/uploads/image|Thumbnails and author avatars|Re-encoded server-side|



### **6.4 Student endpoints** 

|**Metho**<br>**d**|**Endpoint**|**Purpose**|**Notes**|
|---|---|---|---|
|GET /<br>PATCH|/api/student/me|Own profile; update allowed<br>fields only|Whitelist in Zod schema|
|POST|/api/student/me/avatar|Upload avatar||
|GET|/api/student/dashboard|Stats, continue target, courses,<br>expiry notices||
|GET|/api/student/courses|Enrolled courses with progress|Only effective enrollments|
|GET|/api/student/courses/[courseId]|Modules and lectures with status<br>and locks|**No video data**|
|GET|/api/student/lectures/[lectureId]|Lecture metadata, resume point,<br>prev/next|**No video data**|
|POST|/api/student/playback/ticket|Request a one-time playback<br>ticket|Limit 12 per minute|
|POST|/api/student/playback/redeem|Exchange ticket for the player<br>payload|One-time, 90-second validity|
|POST|/api/student/playback/heartbeat|Progress and liveness every 15 s|Can return<br>terminate|
|POST|/api/student/playback/end|Close playback session (also via<br>beacon)||
|POST|/api/student/security/event|Report client-side security events|Server returns the action to take|
|POST|/api/student/session/ping|Keep-alive outside the viewer||
|GET|/api/student/resources/[id]|Download an attachment|Checks enrollment; streams file|



Confidential  -  Sarang Ventures 

Page 20 

LMS Technical Specification  |  Institute of Trading Tricks 

### **6.5 Public and internal endpoints** 

|**Metho**<br>**d**|**Endpoint**|**Purpose**|**Notes**|
|---|---|---|---|
|GET|/api/public/courses|Published courses for the<br>marketing site|Only<br>showOnPublicSite; cached|
|GET|/api/health|Uptime check|No sensitive data|
|POST|/api/cron/expire-enrollments|Mark overdue enrollments<br>expired|Header<br>x-cron-secret|
|POST|/api/cron/rollups|Nightly aggregation into<br>daily_stats,<br>lecture_stats|Idempotent per date|
|POST|/api/cron/cleanup|Close stale playback sessions,<br>purge revoked data||



### **6.6 Critical payloads** 

###### **Request a ticket** 

<mark>POST /api/student/playback/ticket { "lectureId": "665f1c...", "deviceId": "b1c2d3..." } 200 { "ok": true, "data": { "ticket": "<signed JWT, 90 s>", "wm": { "name": "Ali Khan", "email": "ali@example.com", "phone": "+92300...", "code": "ITT-26-0042" }, "resumeAt": 312, "durationSec": 1480, "rates": [0.75, 1, 1.25, 1.5, 2], "heartbeatMs": 15000, "allowSeekAhead": true } }</mark> 

###### **Redeem a ticket** 

<mark>POST /api/student/playback/redeem { "ticket": "<jwt>", "nonce": "<16 random bytes, base64>" } 200 { "ok": true, "data": { "psid": "665f2a...", "p": "<wrapped player payload>" } } 400 { "ok": false, "error": { "code": "TICKET_INVALID", "message": "Ticket not valid" } }</mark> 

###### **Heartbeat** 

<mark>POST /api/student/playback/heartbeat { "psid": "665f2a...", "lectureId": "665f1c...", "from": 326.2, "pos": 341.2, "rate": 1, "state": "playing" } 200 { "ok": true, "data": { "next": 15000, "completed": false, "terminate": null } } 200 { "ok": true, "data": { "terminate": { "code": "ENROLLMENT_EXPIRED" } } }</mark> 

###### **Security event** 

<mark>POST /api/student/security/event { "type": "devtools_open", "lectureId": "665f1c...", "meta": { "probe": "timing" } } 200 { "ok": true, "data": { "action": "pause" } }     // none | warn | pause | logout | lock</mark> 

### **6.7 Business rules** 

|**Rule**|**Definition**|
|---|---|
|**Effective enrollment**|Active status, started, and not past<br>expiresAt(4.3.5). Checked on every ticket and heartbeat,<br>never trusted from the client.|
|**Lecture unlock (drip)**|none: always unlocked.<br>sequential: previous published lecture is complete.<br>daysAfterEnroll:<br>now >= enrollment<br>startsAt+<br>unlockAfterDays.<br>fixedDate: now >= module<br>unlockAt.|
|**Completion**|Unique watched seconds / duration >= course<br>completionThreshold(default 90 percent).<br>Seeking to the end does not complete a lecture.|
|**Course progress**|Completed published lectures / total published lectures. Recomputed on completion and by the<br>nightly job.|



Confidential  -  Sarang Ventures 

Page 21 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Rule**|**Definition**|
|---|---|
|**Continue target**|lastLectureIdif not complete; otherwise the next incomplete unlocked lecture in order;<br>otherwise the last lecture.|
|**Publish readiness**|Title, category, author, thumbnail; at least one published module with one published lecture;<br>every published lecture has a verified video.|
|**Deleting content**|Courses or lectures with learner progress can only be archived or soft-deleted. Hard delete is<br>limited to empty drafts.|
|**Reordering**|Server validates all ids belong to the same course, rewrites<br>orderin one transaction and returns<br>the new tree.|
|**Capacity**|If<br>maxStudentsis set, enrollment beyond it fails with CONFLICT.|



Confidential  -  Sarang Ventures 

Page 22 

LMS Technical Specification  |  Institute of Trading Tricks 

## **7. Secure Video Delivery and Anti-Piracy System** 

This is the most important part of the platform. The design uses defence in depth: no single control is relied upon, and each control is labelled by what it really achieves - **Hard** (server-enforced, cannot be bypassed from the browser), **Deterrent** (raises effort, can be bypassed by an expert) or **Forensic** (identifies the leaker). 

### **7.1 Threat model** 

|**#**|**Threat**|**Primary controls**|**Residual risk**|
|---|---|---|---|
|1|Non-enrolled or expired user obtains<br>videos (IDOR, URL guessing)|Server authorisation on ticket and every heartbeat;<br>no video data in any list or page|Low|
|2|Account sharing|Single device, device and IP anomaly scoring,<br>watermark with owner identity, admin visibility of<br>sessions|Medium|
|3|Copying the video link from the<br>page, DOM or Network tab|No link in UI; ID encrypted at rest; delivered only via<br>one-time ticket; never in HTML/lists; closure-only<br>handling|Medium: an expert can<br>still read the ID from<br>network traffic|
|4|Downloading with yt-dlp or<br>extensions after extracting the ID|As #3, plus leak-response procedure and video<br>rotation (7.13)|Medium|
|5|Opening developer tools|Detection, instant lock-out, blocked shortcuts and<br>context menu|Medium-High: cannot be<br>prevented, only detected|
|6|Screen recording, OBS, phone<br>camera|Moving personalised watermark, forensic tiled mark,<br>accepted terms, audit trail|High: deterrent and<br>forensic only|
|7|Removing the watermark via DOM<br>or CSS|Canvas rendering, tamper monitor, server-issued<br>identity|Low-Medium|
|8|Scraping and automation, headless<br>browsers|Rate limits, ticket TTL, automation checks, behaviour<br>scoring|Low-Medium|
|9|Brute force and credential stuffing|Lock-out, rate limits, bcrypt, no sign-up|Low|
|10|XSS leading to session theft|CSP, DOMPurify, HttpOnly cookies, React escaping|Low|
|11|Embedding our viewer in another<br>site|frame-ancestors 'none', X-Frame-Options|Low|
|12|Insider (admin) leaking links|Refs encrypted and masked in UI, audit log, least<br>privilege|Low|



### **7.2 Defence layers** 

|**Layer**|**Controls**|**Strength**|
|---|---|---|
|**A. Account and access**|Admin-provisioned accounts, single device, status and enrollment<br>checks, expiry enforced during playback|Hard|
|**B. Video reference protection**|Encrypted at rest, ticket + redeem, no ID in HTML/JSON lists,<br>no-<br>store, no logging of IDs|Hard (storage) /<br>Deterrent (delivery)|
|**C. Player hardening**|Hidden YouTube UI, input shield, cropped frame, sandboxed iframe,<br>custom controls|Deterrent|
|**D. Watermarking**|Canvas overlay at random positions with name, email, phone; tiled<br>forensic mark|Forensic + Deterrent|
|**E. Client guards**|Devtools detection, blocked shortcuts, context menu, selection, drag,<br>print, focus-loss handling|Deterrent|



Confidential  -  Sarang Ventures 

Page 23 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Layer**|**Controls**|**Strength**|
|---|---|---|
|**F. Behaviour detection**|Strike scoring and response ladder, anomaly detection on tickets,<br>progress, concurrency|Hard (response) /<br>Detection|
|**G. Platform hardening**|CSP, security headers, rate limits, input validation, secure cookies|Hard|
|**H. Legal and process**|Terms accepted on first login, leak-response playbook, video rotation|Forensic / Process|



### **7.3 Handling the video link (admin side)** 

1. Admin pastes any YouTube URL format (watch, youtu.be, embed, shorts, live) into the lecture form. 

2. <mark>POST /api/admin/video/validate</mark> extracts the 11-character ID, calls YouTube oEmbed server-side to confirm it exists and is embeddable, and returns only the title and thumbnail - never the ID. 

3. <mark>PUT /api/admin/lectures/[id]/video</mark> encrypts the ID with AES-256-GCM, stores <mark>{enc, iv, tag}</mark> plus an HMAC for duplicate detection, and increments <mark>video.version</mark> . 

4. The admin UI shows a masked “YouTube video verified” chip with Replace and Preview buttons. The raw link is not displayed or retrievable afterwards. 

<mark>// lib/crypto.ts const KEY = Bufer.from(process.env.VIDEO_ENC_KEY!, "base64");           // 32 bytes</mark> f <mark>export function encryptRef(plain: string) { const iv = crypto.randomBytes(12); const c = crypto.createCipheriv("aes-256-gcm", KEY, iv); const enc = Bufer.concat([c.update(plain, "utf8"), c.f</mark> f i <mark>nal()]); return { enc: enc.toString("base64"), iv: iv.toString("base64"), tag: c.getAuthTag().toString("base64") }; } export function decryptRef(r: { enc: string; iv: string; tag: string }) { const d = crypto.createDecipheriv("aes-256-gcm", KEY, Bufer.from(r.iv, "base64"));</mark> f <mark>d.setAuthTag(Bufer.from(r.tag, "base64"));</mark> f <mark>return Buf</mark> f <mark>er.concat([d.update(Bufer.from(r.enc, "base64")), d.f</mark> f i <mark>nal()]).toString("utf8"); } export const hmacRef = (id: string) => crypto.createHmac("sha256", KEY).update(id).digest("hex"); // lib/youtube.ts const RE = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/; export const parseYouTubeId = (s: string) => /^[\w-]{11}$/.test(s.trim()) ? s.trim() : RE.exec(s)?.[1] ?? null;</mark> 

##### **YouTube channel checklist (operational)** 

Use a **dedicated Google account with 2-step verification** for the LMS channel; its compromise exposes every unlisted video. 

Set every lecture to **Unlisted** (never Public, never in a playlist or Community post), **Allow embedding = On** , comments off, no end screens or cards, and do not share the watch URL anywhere. 

Keep a private spreadsheet of lecture titles to video mapping so videos can be replaced quickly after a leak. 

### **7.4 Playback ticket flow** 

|**Step**|**Where**|**What happens**|**Server checks**|
|---|---|---|---|
|1|Server component|Viewer page renders a shell containing lecture<br>metadata only|Session, status, enrollment, published, drip<br>unlock|
|2|Browser|Pre-flight: devtools probes, automation<br>checks, visibility; security modules loaded via<br>dynamic import|-|
|3|POST /playback/ticket|Client requests a ticket with its<br>deviceId|Rate limit; no other active stream on a<br>different device; creates ticket (TTL 90 s)<br>bound to user,<br>sid, lecture, IP prefix, UA<br>hash|



Confidential  -  Sarang Ventures 

Page 24 

LMS Technical Specification  |  Institute of Trading Tricks 

|**Step**|**Where**|**What happens**|**Server checks**|
|---|---|---|---|
|4|POST /playback/redeem|Client exchanges the ticket and a random<br>nonce|JWT signature, atomic one-time<br>usedAt<br>update, IP prefix and UA match; decrypts<br>ID; creates<br>playback_sessionsrow|
|5|Browser|Player is built from the payload; the ID lives<br>only in a closure variable, never in React state,<br>props, storage or logs|-|
|6|POST<br>/playback/heartbeat (15<br>s)|Position, rate, state, watched range|Session valid, enrollment still effective,<br>status active, progress plausibility (7.12);<br>may return<br>terminate|
|7|POST /playback/end|Beacon on pause-long, navigation, unload|Closes the session|



<mark>// POST /api/student/playback/ticket  (simplifed)</mark> i <mark>const { user, sid } = await requireStudent(); await assertCanWatch(user._id, lectureId);            // enrollment, status, published, drip await enforceSingleStream(user._id, sid);              // STREAM_ACTIVE if another device is live const jti = nanoid(24); await PlaybackTicket.create({ jti, userId: user._id, sid, lectureId, ipHash: hashIpPref</mark> i <mark>x(ip), uaHash: hash(ua), expiresAt: new Date(Date.now() + 90_000) }); const ticket = await new SignJWT({ lid: lectureId, sid }) .setProtectedHeader({ alg: "HS256" }).setJti(jti).setSubject(String(user._id)) .setIssuedAt().setExpirationTime("90s").sign(TICKET_SECRET); // POST /api/student/playback/redeem  (simplif</mark> i <mark>ed) const { payload } = await jwtVerify(ticket, TICKET_SECRET); const t = await PlaybackTicket.f</mark> i <mark>ndOneAndUpdate( { jti: payload.jti, usedAt: null, userId: payload.sub, sid: payload.sid, ipHash: hashIpPref</mark> i <mark>x(ip) }, { usedAt: new Date() }); if (!t) { await logSecurityEvent("ticket_replay", ...); throw new ApiError("TICKET_INVALID", 400); } const lec = await Lecture.f</mark> i <mark>ndById(payload.lid).select("+video.ref"); const videoId = decryptRef(lec.video.ref); const ps = await PlaybackSession.create({ userId: payload.sub, lectureId: payload.lid, sid, startedAt: new Date() }); return { psid: ps._id, p: wrapPayload(videoId, nonce) };    // Cache-Control: no-store</mark> 

##### **What the ticket does and does not do** 

The ticket makes the **server decide on every play** (enrollment, expiry, device, rate) and creates an audit trail. The <mark>wrapPayload</mark> step (a per-ticket XOR/AES wrap) only prevents the ID from appearing as a readable string in the Network preview; anyone who can run the page's JavaScript can unwrap it. It is a deterrent, not encryption against the student. Binding the ticket to an IP prefix (/24 for IPv4, /48 for IPv6) tolerates normal mobile IP changes while stopping a stolen ticket from being used elsewhere. 

### **7.5 Player hardening** 

The player is a React component ( <mark>player-shell.tsx</mark> ) loaded client-side only. YouTube cannot be drawn into a canvas (cross-origin), so the design layers our own canvas and controls above a fully inert YouTube iframe. 

#### **Layer stack (bottom to top)** 

|**z**|**Layer**|**Behaviour**|
|---|---|---|
|**0**|YouTube iframe|pointer-events: none; oversized and cropped; receives commands only through the<br>IFrame API|
|**1**|Canvas watermark|Draws name, email, phone and forensic tiling;<br>pointer-events: none|
|**2**|Interaction shield|Transparent div capturing all pointer events; swallows context menu, double-click,<br>drag|
|**3**|Custom control bar|Our own UI; auto-hides; touch friendly|
|**4**|Lock screen|Opaque panel shown on violation, expiry, replaced session; fully hides the video|



Confidential  -  Sarang Ventures 

Page 25 

LMS Technical Specification  |  Institute of Trading Tricks 

#### **YouTube parameters and iframe attributes** 

|**Setting**|**Value**|**Reason**|
|---|---|---|
|**controls**|0|Remove YouTube control bar|
|**disablekb**|1|Remove YouTube keyboard shortcuts (we add<br>our own)|
|**fs**|0|Disable YouTube fullscreen; we fullscreen our<br>own container so the watermark stays|
|**rel**|0|Limit related videos|
|**iv_load_policy**|3|No annotations|
|**playsinline**|1|Inline playback on iOS|
|**enablejsapi / origin**|1 / APP_ORIGIN|Required for API control|
|**host**|https://www.youtube-nocookie.com|Privacy-enhanced embed domain|
|**iframe**<br>**allow**|autoplay; encrypted-media only|Omit<br>picture-in-pictureand<br>fullscreen|
|**iframe**<br>**sandbox**|allow-scripts allow-same-origin allow-<br>presentation|Omit<br>allow-popupsso “Watch on YouTube”<br>cannot open a tab|
|**Referrer-Policy**|strict-origin-when-cross-origin|YouTube may reject embeds that send no<br>referrer|
|// security/player-shell.tsx (co<br>function mountPlayer(host:<br>const frame = document.cre<br>host.prepend(frame);<br>const player = new YT.Playe<br>videoId, host: "https://www<br>playerVars: { controls: 0, d<br>enablejsapi: 1, orig<br>events: { onReady: () => { h<br>});<br>return player;<br>|re of initialisation)<br>HTMLElement, videoId: string, onState: (s: number) => v<br>ateElement("div");<br>// iframe is created by the YT API<br>r(frame, {<br>.youtube-nocookie.com",<br>isablekb: 1, fs: 0, rel: 0, iv_load_policy: 3, playsinline: 1,<br>in: location.origin, autoplay: 0, cc_load_policy: 0 },<br>ardenIframe(host.querySelector("iframe")!); }, onStateC<br>// videoId is not kept anywhere else|oid) {<br>hange: (e) => onState(e.data) },|
|}<br>function hardenIframe(f: HT<br>f.style.pointerEvents = "non<br>f.setAttribute("sandbox", "a<br>f.setAttribute("allow", "auto<br>f.removeAttribute("allowfu<br>f.style.cssText += ";position:<br>}|MLIFrameElement) {<br>e";<br>llow-scripts allow-same-origin allow-presentation");<br>play; encrypted-media");<br>llscreen");<br>absolute;left:0;width:100%;top:-60px;height:calc(100% +|120px)";  // crop title/logo|



- **Cropping:** the host has <mark>overf</mark> l <mark>ow:hidden</mark> and the iframe is taller than the visible area, so YouTube's title bar and bottom-right logo are pushed outside the visible frame. 

- **Loading cover:** an opaque cover with our logo is shown until the first PLAYING event so no YouTube thumbnail or title flashes. 

- **End of video:** on ENDED the player calls <mark>stopVideo()</mark> and immediately shows our “Lecture complete” panel, hiding YouTube's end screen. 

- **Paused state:** YouTube's paused overlay is covered by a slight dim layer from our shield. A setting <mark>(blurOnPause</mark> , default off) can fully hide the frame on pause for maximum protection at the cost of student convenience. 

- **Fullscreen:** the Fullscreen API is applied to our container, not the iframe. iPhone Safari does not support element fullscreen, so a CSS “pseudo-fullscreen” (fixed, inset 0) is used there. 

### **7.6 Custom controls** 

Only these controls are shown, all calling the IFrame API ( <mark>playVideo</mark> , <mark>pauseVideo</mark> , <mark>seekTo</mark> , <mark>setVolume</mark> , <mark>setPlaybackRate</mark> ): play/pause, back and forward 10 seconds, seek bar with buffered indicator (honouring 

Confidential  -  Sarang Ventures 

Page 26 

LMS Technical Specification  |  Institute of Trading Tricks 

<mark>allowSeekAhead</mark> ), current time and duration, volume and mute, speed (only <mark>allowedRates</mark> ), our fullscreen, and next lecture. Keyboard shortcuts (space, arrows, M, F) are handled by our code only on the viewer. No quality menu, no share, no “copy link”, no “watch on YouTube”. 

### **7.7 Canvas watermark engine** 

The watermark is drawn on a <mark><canvas></mark> rather than inserted as DOM text, so it cannot be removed by deleting a text node or edited in the Elements panel, and it cannot be selected or copied. The identity comes from the server (the ticket response), not from editable client state. 

|**Parameter**|**Value**|
|---|---|
|**Content**|Three lines: name, email, phone (student code in the forensic tile)|
|**Positions**|Nine slots: top-left, top-center, top-right, mid-left, center, mid-right, bottom-left, bottom-center,<br>bottom-right, with small random jitter inside the slot|
|**Movement**|New slot every 6 to 14 seconds (random, via<br>crypto.getRandomValues); never the same slot<br>twice in a row; 400 ms fade between positions|
|**Appearance**|White text at 40-55 percent opacity with a dark outline so it is legible on light and dark footage;<br>font size about 1.3 percent of player width (minimum 11 px)|
|**Forensic tile**|Very faint (about 6 percent) diagonal repeating pattern of the student code across the whole<br>frame, surviving crops of the corners|
|**Visibility**|Drawn at all times, including paused, buffering and fullscreen; sized with<br>devicePixelRatio|
|**Admin preview**|Shows “ADMIN PREVIEW” plus the admin's name|



<mark>// security/watermark-engine.ts const SLOTS = ["tl","tc","tr","ml","c","mr","bl","bc","br"] as const; const rnd = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32; export class WatermarkEngine { private slot = SLOTS[Math.f</mark> l <mark>oor(rnd() * 9)]; private prev = ""; private alpha = 1; private raf = 0; private timer = 0; constructor(private cv: HTMLCanvasElement, private id: { name: string; email: string; phone: string; code: string }) {} start() { const loop = () => { this.draw(); this.raf = requestAnimationFrame(loop); }; loop(); this.schedule(); } stop() { cancelAnimationFrame(this.raf); clearTimeout(this.timer); } private schedule() { this.timer = window.setTimeout(async () => { await this.fade(0); do { this.slot = SLOTS[Math.f</mark> l <mark>oor(rnd() * 9)]; } while (this.slot === this.prev); this.prev = this.slot; await this.fade(1); this.schedule(); }, 6000 + rnd() * 8000); } private draw() { const ctx = this.cv.getContext("2d")!, w = this.cv.width, h = this.cv.height; ctx.clearRect(0, 0, w, h); ctx.save(); ctx.globalAlpha = 0.06; ctx.f</mark> i <mark>llStyle = "#f</mark> **f** <mark>"; ctx.rotate(-Math.PI / 6); for (let y = -h; y < h * 2; y += h / 5) for (let x = -w; x < w * 2; x += w / 3) ctx.f</mark> i <mark>llText(this.id.code, x, y); ctx.restore(); const fs = Math.max(11, w * 0.013) * devicePixelRatio; ctx.font = "600 " + fs + "px system-ui, sans-serif"; const lines = [this.id.name, this.id.email, this.id.phone]; const bw = Math.max(...lines.map((l) => ctx.measureText(l).width)), bh = fs * 3.6, pad = w * 0.03; const [x, y] = place(this.slot, w, h, bw, bh, pad); ctx.globalAlpha = 0.5 * this.alpha; ctx.lineWidth = 3; ctx.strokeStyle = "rgba(0,0,0,.6)"; ctx.f</mark> i <mark>llStyle = "#f</mark> **f** <mark>"; lines.forEach((l, i) => { ctx.strokeText(l, x, y + fs * (i + 1) * 1.15); ctx.f</mark> i <mark>llText(l, x, y + fs * (i + 1) * 1.15); }); } }</mark> 

### **7.8 Tamper monitor** 

A separate module checks once per second (and on every DOM mutation inside the player) that the protection is intact. Any failure pauses the video, covers it with the lock screen and reports a <mark>tamper_*</mark> event. 

<mark>// security/tamper-monitor.ts export function startTamperMonitor(o: { host: HTMLElement; canvas: HTMLCanvasElement; shield: HTMLElement; onViolation: (why: string) => void }) {</mark> 

Confidential  -  Sarang Ventures 

Page 27 

LMS Technical Specification  |  Institute of Trading Tricks 

<mark>const check = () => { const { host, canvas, shield, onViolation } = o; if (!host.isConnected || !host.contains(canvas)) return onViolation("canvas_removed"); const cs = getComputedStyle(canvas); if (cs.display === "none" || cs.visibility !== "visible" || +cs.opacity < 0.99 || cs.f</mark> i <mark>lter !== "none" || cs.clipPath !== "none" || cs.mixBlendMode !== "normal") return onViolation("canvas_hidden"); const r = canvas.getBoundingClientRect(), h = host.getBoundingClientRect(); if (r.width < h.width * 0.98 || r.height < h.height * 0.98) return onViolation("canvas_resized"); const top = document.elementFromPoint(h.left + h.width / 2, h.top + h.height / 2); if (top !== shield) return onViolation("overlay_injected");        // someone placed an element above the shield if (!canvasHasInk(canvas)) return onViolation("canvas_blank");     // sample pixels, text really drawn }; const mo = new MutationObserver(check); mo.observe(host, { subtree: true, childList: true, attributes: true }); const t = setInterval(check, 1000); return () => { mo.disconnect(); clearInterval(t); }; }</mark> 

### **7.9 Client guards and developer-tools detection** 

##### **Be clear with the client** 

Browsers never let a site stop devtools from opening. What we can do is detect it quickly using several independent probes and immediately destroy the player, so there is nothing to inspect. A determined user can still bypass client code (for example by disabling breakpoints or using another profile or a proxy), which is why the server-side layers and the watermark exist. 

|**Guard**|**Method**|**Notes**|
|---|---|---|
|**Docked devtools**|outerWidth - innerWidthor height difference above<br>160 px on desktop|Skipped on mobile; needs two<br>consecutive hits to avoid zoom false<br>positives|
|**Debugger timing**|Run a<br>debuggerstatement and measure the time taken|Triggers only when devtools is open<br>with breakpoints active|
|**Console probe**|console.debugan object whose getter fires when the<br>console renders it|Works in several Chromium and<br>Firefox versions|
|**Blocked shortcuts**|F12, Ctrl/Cmd+Shift+I/J/C/K, Ctrl+U, Ctrl+S, Ctrl+P,<br>Cmd+Opt+I/J/C/U|Each attempt logs a low-score event<br>(capped)|
|**Context menu, drag, select,**<br>**copy**|Event listeners call<br>preventDefault(); CSS<br>user-<br>select:none|Viewer page only|
|**Print and PrintScreen**|@media print { body{display:none} }; on PrintScreen<br>keyup clear clipboard and hide video for 1.5 s|Cannot stop OS-level capture|
|**Focus loss**|On<br>visibilitychangeor<br>blur, pause playback and dim<br>the frame|Configurable|
|**Automation**|navigator.webdriver, missing plugins/languages,<br>headless UA|Raises a<br>headlessevent|
|**Display capture**|Permissions-Policy<br>display-capture=()and wrapping<br>getDisplayMediaon our page|Only affects capture started from this<br>page, not from other tabs or the OS|
|**Source obfuscation**|javascript-obfuscatoron the<br>security/bundle; source<br>maps disabled|Raises effort only|



Confidential  -  Sarang Ventures 

Page 28 

LMS Technical Specification  |  Institute of Trading Tricks 

<mark>// security/devtools-guard.ts export function startDevtoolsGuard(onOpen: (probe: string) => void) { const mobile = /Android|iPhone|iPad/i.test(navigator.userAgent); let hits = 0, open = false; const probes: Array<[string, () => boolean]> = [ ["size", () => !mobile && (outerWidth - innerWidth > 160 || outerHeight - innerHeight > 160)], ["timing", () => { const t = performance.now(); (function () { debugger; })(); return performance.now() - t > 100; }], ["console", () => { let hit = false; const el = new Image(); Object.def</mark> i <mark>neProperty(el, "id", { get() { hit = true; return ""; } }); console.debug(el); return hit; }], ]; const id = setInterval(() => { const hit = probes.fnd(([, f]) => { try { return f(); } catch { return false; } });</mark> i <mark>if (hit) { if (++hits >= 2 && !open) { open = true; onOpen(hit[0]); } } else { hits = 0; } }, 700); return () => clearInterval(id); }</mark> 

#### **What happens when devtools or tampering is detected** 

1. **Within one second:** pause, remove the YouTube iframe from the DOM, clear the video reference and ticket from memory, show the lock screen (“Close developer tools to continue”). 

2. The client sends <mark>POST /api/student/security/event</mark> . The server records the event, updates the strike score and returns the action to apply (7.10). 

3. To resume, the student must close devtools and reload; a fresh ticket is required, so the video cannot restart from the locked state. 

### **7.10 Behaviour detection and response ladder** 

|**Event type**|**Points**|**Trigger**|
|---|---|---|
|**devtools_open**|3|Two consecutive probe hits|
|**tamper_***|5|Canvas removed, hidden, resized, overlay injected, blank|
|**ticket_replay**|5|Reused or foreign ticket at redeem|
|**headless**|5|Automation signature|
|**multi_stream**|3|Second device tried to play while another stream was live|
|**progress_anomaly**|2|Watched time implausibly faster than real time|
|**blocked_shortcut**|1 (max 3 per hour)|Blocked key combination attempted|
|**rate_limit**|1|Repeated 429 responses on playback endpoints|
|**geo_jump**|2|Large IP change within a short time (coarse, prefix-based)|



Score is the sum over a rolling seven days. Thresholds are configurable in Settings > Platform: 

|**Score**|**Automatic action**|**Admin visibility**|
|---|---|---|
|**0-2**|Log only|Event list|
|**3-7**|Warn and pause the lecture; show a clear message about the<br>terms|Flag on student; appears in dashboard<br>alerts|
|**8-14**|Force logout (session revoked) and 30-minute cooldown|High-severity alert|
|**15 or more**|Account security-locked; student sees “Contact administrator”|Critical alert; admin must review and<br>unlock with a note|



### **7.11 HTTP security headers and CSP** 

<mark>// next.conf</mark> i <mark>g.js  (headers for /student/** and /api/**) const csp = [</mark> 

Confidential  -  Sarang Ventures 

Page 29 

LMS Technical Specification  |  Institute of Trading Tricks 

<mark>"default-src 'self'", "script-src 'self' 'nonce-{NONCE}' https://www.youtube.com https://www.youtube-nocookie.com https://s.ytimg.com", "frame-src https://www.youtube-nocookie.com https://www.youtube.com", "img-src 'self' data: blob: https://i.ytimg.com", "style-src 'self' 'unsafe-inline'", "connect-src 'self'", "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'", ].join("; "); headers: [ { key: "Content-Security-Policy", value: csp },                      // nonce injected in middleware { key: "X-Frame-Options", value: "DENY" }, { key: "X-Content-Type-Options", value: "nosnif" },</mark> f <mark>{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }, { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), display-capture=(), picture-in-picture=()" }, { key: "Cache-Control", value: "no-store" },                         // viewer page and student/admin APIs ]</mark> 

Run the CSP in report-only mode first, load a lecture, and add any additional YouTube hosts that appear. The exact allow-list can change when YouTube updates its player, so the CSP test (Section 11) must be re-run after any player-related incident. 

### **7.12 Progress tracking integrity** 

Progress drives completion and analytics, and it must not be forgeable by seeking or by calling the API directly. 

<mark>// services/progress.service.ts  (heartbeat handler core) const dt = (now - ps.lastHeartbeatAt) / 1000;                     // wall-clock seconds since last beat const maxAdvance = dt * Math.min(body.rate, 2) * 1.25 + 2;        // plausible media seconds const span = body.pos - body.from; if (span < 0 || span > maxAdvance) { await fag("progress_anomaly"); }       // do not credit</mark> l <mark>else { progress.watchedRanges = mergeRange(progress.watchedRanges, [body.from, body.pos]); } progress.uniqueWatchedSec = sumRanges(progress.watchedRanges); progress.percent = Math.min(100, (progress.uniqueWatchedSec / duration) * 100); if (progress.percent >= course.settings.completionThreshold) progress.status = "completed"; progress.lastPositionSec = body.pos;</mark> 

- Credit is given only for contiguous playback segments reported by the heartbeat, merged into unique ranges; skipping forward earns nothing. 

- The server also re-checks the enrollment and the <mark>sid</mark> on every heartbeat, which is how an expired student or a replaced device is cut off within 15 seconds. 

- Two missed heartbeats close the playback session automatically ( <mark>endReason: timeout</mark> ). 

### **7.13 What cannot be prevented and the leak-response playbook** 

|**Cannot be prevented**|**Why**|**How we limit the damage**|
|---|---|---|
|**Screen recording or a phone camera**|Happens outside the browser|Personalised moving watermark, forensic<br>tiling, accepted terms|
|**Extracting the video ID from network**<br>**traffic**|The browser must receive the ID to<br>stream from YouTube|One-time ticket, no ID in pages, fast<br>rotation, behaviour detection|
|**Bypassing client-side checks with a**<br>**modified browser**|Client code runs on the user's machine|Server remains the authority on access and<br>progress|



#### **Leak-response playbook** 

1. Identify the student from the watermark name, email, phone or forensic code; look up the record in Student Management. 

2. Lock the account and revoke sessions; export sessions, devices and security events for that student. 

3. Rotate the exposed lecture: re-upload to YouTube as a new unlisted video, use **Replace link** (this takes under a minute because the ID is only in the database), then set the old video to Private or delete it. 

Confidential  -  Sarang Ventures 

Page 30 

LMS Technical Specification  |  Institute of Trading Tricks 

4. Apply the consequences stated in the terms the student accepted; document the case in the audit log. 

### **7.14 Future upgrade path: provider abstraction** 

All playback goes through a <mark>VideoProvider</mark> interface so the host can change without rewriting the viewer, admin forms or analytics. 

<mark>interface VideoProvider { name: "youtube" | "bunny" | "vimeo" | "cloudf</mark> l <mark>are"; validate(input: string): Promise<{ ref: string; title?: string; thumbnail?: string }>; createPlayer(host: HTMLElement, ref: string, ctx: PlayerContext): Promise<PlayerAdapter>;  // play, pause, seek, rate... }</mark> 

##### **When to upgrade** 

If observed leaks continue, if the content becomes premium, or if the institute wants true protection, move to a lowcost host that offers signed, expiring stream URLs, domain locking and DRM (Widevine/FairPlay) - for example Bunny Stream, Cloudflare Stream or Vimeo with domain privacy. The ticket flow, watermark, guards and analytics in this design carry over unchanged; only the provider adapter is replaced. DRM is the only technique that can stop most recording tools and downloaders. 

### **7.15 YouTube policy risk** 

##### **Business risk the client should acknowledge** 

Hiding or covering the embedded player's interface, cropping its branding and blocking its controls may conflict with YouTube's Terms of Service and API Services policies. YouTube could limit playback or act against the channel. Review the current policies before launch and record the client's acceptance of this risk, or choose a different video host (7.14). 

Confidential  -  Sarang Ventures 

Page 31 

LMS Technical Specification  |  Institute of Trading Tricks 

## **8. Frontend Plan** 

### **8.1 Design system** 

|**Area**|**Specification**|
|---|---|
|**Brand**|Reuse the existing website tokens (colours, logo, fonts). Suggested base: deep navy primary, gold<br>accent, neutral greys, as in the Sarang Ventures and proposal styling|
|**Components**|shadcn/ui on Radix primitives: Button, Input, Select, Combobox, Dialog, Sheet, Tabs, Accordion,<br>Table, Badge, Toast (sonner), Skeleton, Command palette|
|**Typography**|Inter (or the site font); 14 px base for admin density, 16 px for student reading; clear hierarchy|
|**Spacing and shape**|4 px grid; 8-12 px radii; subtle shadows; consistent card padding|
|**Status colours**|Success (active, completed), warning (expiring, drip-locked), danger (suspended, expired, security),<br>neutral (draft, inactive); never colour alone, always icon or text too|
|**Theme**|Light and dark via<br>next-themes; admin defaults to system, student defaults to light|
|**Motion**|Short (150-200 ms) transitions; respect<br>prefers-reduced-motion|



### **8.2 Layouts and navigation** 

- **Admin shell:** collapsible left sidebar (Dashboard, Students, Courses, Analytics, Settings), top bar with breadcrumbs, global search / command palette (Ctrl+K), theme toggle and profile menu. Desktop-first; usable down to tablet width. 

- **Student shell:** clean top navigation (logo, Dashboard, My Courses, Settings, avatar menu) on desktop; bottom tab bar on mobile. Mobile-first. 

- **Viewer layout:** a separate focus layout with no main navigation, only a back arrow, the secure player, a collapsible curriculum sidebar and lecture details. Security modules load only here. 

### **8.3 Admin pages** 

#### **8.3.1 Dashboard** 

- **KPI cards** (with change versus previous period): total students, active students, published courses, active enrollments, watch hours (30 days), average completion rate, enrollments expiring in 7 days, open security alerts. 

- **Charts:** new students and enrollments over time (area), daily watch hours (bar), top courses by active learners (horizontal bar), completion by course. 

- **Lists:** expiring enrollments (with Extend action), flagged students, at-risk students (inactive 7+ days), recent activity feed. 

- Global date-range selector; quick actions: Add student, Add course, Enroll students. 

#### **8.3.2 Student Management** 

- **List:** server-paginated table with search (name, email, phone, code), filters (status, course, enrollment status, joined range, tags), sortable columns, column visibility, saved filter in the URL. 

- **Columns:** avatar and name, student code, email, phone, status badge, number of courses, average progress, last active, joined date, row actions. 

- **Bulk actions:** activate, deactivate, suspend, enroll in course, export CSV, delete; confirmation dialog with count. 

Confidential  -  Sarang Ventures 

Page 32 

LMS Technical Specification  |  Institute of Trading Tricks 

- **Add / edit student** (full page, sectioned form with sticky save bar): Identity (name, email, phone, DOB, gender, ID number); Address; Learning profile (experience level, education, occupation, source, tags, emergency contact); **Account** (status, password with Generate, strength meter, show-once dialog with copy and message template); Enrollments (courses, start date, access duration or expiry); Admin notes. Async uniqueness check for email. 

- **CSV import:** upload, column mapping, dry-run validation report with per-row errors, then commit. 

- **Student detail** with tabs: Overview (stats and mini-charts), Profile, Enrollments (extend, change status, revoke), Progress (per course, expandable to lecture level), Devices and Sessions (force logout), Security (event timeline, strike score, unlock), Activity (audit). 

- Header actions: Edit, Reset password, Force logout, Suspend or Activate, Delete (soft). 

#### **8.3.3 Course Management** 

**Course list:** grid or table toggle; filters for status, category, author, difficulty; search; cards show thumbnail, status, modules and lectures count, duration, enrolled count and completion rate; actions Edit, Duplicate, Archive, Delete. 

**Course builder** <mark>(/admin/courses/[id]</mark> ) mirrors the reference screen the client shared, minus pricing. Tabs: **Details | Curriculum | Settings | Students | Preview** . 

|**Area**|**Content**|
|---|---|
|**Main column**|Title with auto slug (editable, shows course URL); rich-text Description with media; Options panel<br>with tabs General (difficulty, language, learning outcomes, requirements, audience), Content Drip<br>(none, sequential, days after enrollment, fixed date), Enrollment (default access days, max students,<br>start/end dates)|
|**Right sidebar**|Status (Draft, Published, Archived); Schedule toggle with date-time; Featured image (drag-drop, 16:9<br>crop, up to 5 MB); optional public Intro video link;**Categories**multi-select with “Create new” inline;<br>**Tags**chips;**Author**single select with “Add new author” dialog (name, title, bio, avatar)|
|**Not included**|Pricing model and free/paid options are intentionally omitted|
|**Footer**|Sticky bar: Save draft, Publish, Next. Autosave every 30 seconds; unsaved-changes guard|



- **Curriculum tab:** a tree of module cards (collapsible, drag handle, inline rename, status, lecture count and duration), each containing lecture rows (drag handle, title, duration, video status chip, status toggle, menu: Edit, Duplicate, Move to module, Delete). Drag-and-drop with dnd-kit, optimistic update and rollback on error. 

- **Lecture editor** (side sheet): Title, Description, **Video link** (paste, validate, shows verified chip with oEmbed title and thumbnail, Replace, Preview), Duration (auto from preview or manual), Resources upload (PDF/ZIP up to 20 MB), Drip (unlock after N days), Status. 

- **Bulk add lectures:** paste several YouTube links, one per line, to create lectures in one step; titles are prefilled from oEmbed. 

- **Readiness panel:** live checklist of what is missing before Publish (thumbnail, category, author, lectures without verified video). 

- **Students tab:** enrolled students with progress and expiry; enroll multiple students at once. 

- **Preview tab:** “Preview as student” using the same secure player, watermarked as ADMIN PREVIEW. 

#### **8.3.4 Analytics** 

Tabs: **Overview | Students | Courses | Engagement | Security** , with date-range presets, course and category filters and CSV export. Full metric definitions are in Section 9. 

Confidential  -  Sarang Ventures 

Page 33 

LMS Technical Specification  |  Institute of Trading Tricks 

#### **8.3.5 Settings** 

- **Profile:** avatar upload with circular crop, name, phone, email (changing email asks for the current password). 

- **Security:** change password (current, new, confirm, strength meter); list of active sessions with Revoke. 

- **Platform (optional tab):** device limit, session lifetime, strike thresholds, watermark tuning, default access days, devtools guard toggle. 

### **8.4 Student pages** 

#### **8.4.1 Dashboard** 

- Greeting and four stat tiles: courses enrolled, lectures completed, hours watched, current learning streak. 

- **Continue learning** hero card: course, module, lecture title, progress ring and a primary **Continue** button that opens the viewer at the saved position. 

- My courses grid with progress bars and access badges (for example “12 days left”, “Expired”); small weekly watch-time chart; notices for expiring or expired access. 

#### **8.4.2 Enrolled courses** 

Cards for every enrollment with thumbnail, author, category, progress and expiry. Expired courses stay visible but locked with a clear message. 

#### **8.4.3 Course detail** 

Header with thumbnail, title, author, category and overall progress; **Continue** button; accordion of all modules, each showing its lectures with status icon (not started, in progress, completed, locked with unlock date), duration and resource count. No video data is ever included in this page's payload. 

#### **8.4.4 View Course (secure viewer)** 

- **Layout:** 16:9 secure player on top (sticky on mobile), curriculum sidebar on desktop (tabs below the player on mobile), lecture title, description, resources, previous and next buttons. Lecture auto-completes by the progress rules (6.7). 

- **Behaviour:** pre-flight checks, ticket and redeem, player mount, heartbeat, watermark and guards as specified in Section 7. The page has no YouTube links, no copyable URL and no text selection. 

- **States:** loading cover, ready, locked (drip), expired, session replaced, devtools or tamper lock, offline, error with retry. Each has a distinct message and no technical detail. 

- **First visit:** the student accepts the content-protection terms (stored in <mark>acceptedTermsAt</mark> ). 

- **Mobile:** touch-sized controls; landscape uses pseudo-fullscreen on iPhone; watermark scales with player width. 

#### **8.4.5 Settings** 

- Shows name, email, phone and student code as **read-only** (they appear in the watermark and identify the account), with the note “Contact your administrator to change these”. 

- Editable: address, date of birth, gender, education, occupation, emergency contact and avatar (JPEG/PNG/WebP up to 2 MB, cropped to square). 

- **No password section.** Password changes are performed by the admin only. 

##### **Decision for the client** 

The brief says students can edit “info” but not specify which. We recommend locking name, email and phone because they feed the watermark and audit trail. If the client wants phone to be editable, changes should be logged and shown to the admin. 

Confidential  -  Sarang Ventures 

Page 34 

LMS Technical Specification  |  Institute of Trading Tricks 

### **8.5 Shared components** 

|**Component**|**Used in**|**Notes**|
|---|---|---|
|**DataTable (TanStack)**|Students, courses, enrollments, analytics|Server pagination, sorting, filters in URL|
|**ComboboxCreatable**|Categories, authors, tags|Select existing or create inline|
|**SortableTree (dnd-kit)**|Curriculum builder|Keyboard accessible, optimistic reorder|
|**ImageUploader**|Thumbnail, avatars|Crop, preview, size and type validation|
|**RichTextEditor (Tiptap)**|Course description|Sanitised on save|
|**StatCard / ProgressRing /**<br>**Sparkline**|Dashboards|Consistent metrics display|
|**ChartKit (Recharts)**|Analytics|Themed area, bar, line, heatmap wrappers|
|**ConfirmDialog, EmptyState,**<br>**ErrorState**|Everywhere|Destructive actions always confirmed|
|**SecurePlayer**|Viewer, admin preview|player-shell, watermark, tamper monitor,<br>guards|
|**PasswordField (strength meter)**|Student form, admin settings|zxcvbn-based|



### **8.6 State and data patterns** 

- Server components fetch first-paint data; client islands use TanStack Query with <mark>keepPreviousData</mark> for tables and optimistic updates for reorder and status toggles. 

- Forms use React Hook Form with the **same Zod schemas** as the API <mark>(lib/validators</mark> ), so client and server validation never drift. 

- Route-level <mark>loading.tsx</mark> skeletons and <mark>error.tsx</mark> boundaries; toasts for results; every destructive action behind a confirm dialog. 

- Filters, sorting and pagination live in the URL so views are shareable and survive refresh. 

### **8.7 Accessibility and quality** 

- WCAG 2.1 AA contrast, visible focus rings, full keyboard navigation, labelled form controls, ARIA live regions for toasts, accessible drag-and-drop alternatives (move up/down buttons). 

- Responsive breakpoints at 640, 1024 and 1280 px; touch targets of at least 44 px on the student side. 

- Core Web Vitals targets: LCP under 2.5 s on the student dashboard on a mid-range phone over 4G. 

Confidential  -  Sarang Ventures 

Page 35 

LMS Technical Specification  |  Institute of Trading Tricks 

## **9. Analytics Specification** 

### **9.1 Metric definitions** 

#### **Per student** 

|**Metric**|**Definition**|**Source**|
|---|---|---|
|**Overall progress**|Completed lectures / total published lectures across active<br>enrollments|enrollments,<br>lecture_progress|
|**Watch time**|Sum of<br>watchedSecin a period (and total including re-watches)|playback_sessions|
|**Active days and streak**|Distinct UTC days with at least one heartbeat; consecutive-day streak|playback_sessions|
|**Average session length**|Mean session duration of playback sessions|playback_sessions|
|**Last active**|Most recent heartbeat or login|playback_sessions, users|
|**Time to complete**|Days between enrollment and course completion|enrollments|
|**Engagement score (0-100)**|35% progress + 25% consistency (active days / days enrolled, capped)<br>+ 25% recency (decays over 14 days) + 15% completion rate of<br>started lectures|Derived|
|**Risk flag**|At-risk if no activity for 7+ days with progress below 100%, or<br>engagement score below 30; Security flag if strike score is 3 or more|Derived|



#### **Per course** 

|**Metric**|**Definition**|**Visualisation**|
|---|---|---|
|**Enrolled / active learners**|Enrollments total and those with activity in the last 14 days|KPI + trend line|
|**Completion rate**|Enrollments with<br>completedAt/ enrollments|KPI|
|**Average progress**|Mean<br>progress.percent|Bar by course|
|**Module funnel**|Learners who completed at least one lecture in each module in order|Funnel chart|
|**Lecture drop-off**|Percentage of learners who started a lecture but did not reach the<br>threshold|Ranked table|
|**Watch heatmap**|Watch count per 10-second bucket per lecture; reveals re-watched or<br>skipped parts|Heat strip in lecture row|
|**Cohort retention**|Weekly cohort of enrollments vs active in following weeks|Heatmap table|
|**Expiry outlook**|Enrollments expiring in 7, 30, 60 days|Stacked bar|



#### **Platform and security** 

- Daily, weekly and monthly active students; new students and enrollments per day; total watch hours per day; peak-time heatmap (hour of day by weekday); top courses and lectures; category mix. 

- Security: events by type and severity, flagged students, top lectures by incidents, devices per student, sessions replaced, rate-limit hits. 

### **9.2 Computation approach** 

- **Nightly rollup** <mark>(/api/cron/rollups</mark> , shortly after midnight Asia/Karachi) aggregates the previous day from <mark>playback_sessions</mark> , <mark>lecture_progress</mark> , <mark>enrollments</mark> and <mark>security_events</mark> into <mark>daily_stats</mark> and refreshes <mark>lecture_stats</mark> . It is idempotent per date. 

Confidential  -  Sarang Ventures 

Page 36 

LMS Technical Specification  |  Institute of Trading Tricks 

- **Live queries** are used only for today and small ranges, always on indexed fields with <mark>$match</mark> first and a limited date window. 

- Charts read <mark>daily_stats</mark> ; tables read live data with pagination. Dashboard responses are cached for 60 seconds. 

- Exports stream CSV rows (never build giant arrays in memory) and exclude any credential or video data. 

Confidential  -  Sarang Ventures 

Page 37 

LMS Technical Specification  |  Institute of Trading Tricks 

## **10. Non-Functional Requirements** 

|**Area**|**Target / approach**|
|---|---|
|**Performance**|List endpoints p95 under 400 ms on M0; heartbeat under 150 ms; viewer ready (ticket + redeem +<br>player ready) under 3 s on broadband|
|**Capacity**|Heartbeat load for 100 concurrent viewers is about 400 requests per minute (about 7 per second)<br>with one small write each, comfortably inside M0 limits|
|**Scalability path**|Upgrade Atlas tier, move rate limits to Redis/Upstash, add read replicas for analytics; provider<br>abstraction for video|
|**Availability**|Health endpoint monitored by an external uptime service; graceful error pages; no single-process<br>state|
|**Observability**|Structured JSON logs (pino) with request ids; optional Sentry; admin-visible audit and security<br>timelines. Never log passwords, tokens, cookies or video IDs|
|**Backups**|M0 has no automated backups: schedule an export script (users, courses, modules, lectures,<br>enrollments, progress) to private storage and rehearse a restore. Move to a paid tier with backups<br>before large-scale use|
|**Privacy**|Collect only needed personal data; ID number and address visible to admins only;<br>deletion/anonymisation on request; clear privacy policy and terms of use|
|**Compatibility**|Browsers listed in 1.5; graceful message for unsupported browsers|



Confidential  -  Sarang Ventures 

Page 38 

LMS Technical Specification  |  Institute of Trading Tricks 

## **11. Testing and QA** 

|**Level**|**Tools**|**Coverage**|
|---|---|---|
|**Unit**|Vitest|Zod schemas, crypto helpers, YouTube URL parser, access<br>and drip rules, range merging, strike scoring|
|**Integration**|Vitest + mongodb-memory-server|Route handlers with real Mongoose: auth, enrollment,<br>ticket/redeem/heartbeat, reorder, import|
|**End-to-end**|Playwright|Admin creates course and student, enrolls; student logs in,<br>watches, progress saves; expiry and session replacement|
|**Security**|Playwright + scripts + manual review|Checklist below|
|**Cross-browser/device**|BrowserStack or real devices|Chrome, Edge, Firefox, Safari desktop; Android Chrome;<br>iPhone Safari|
|**Load**|k6 or autocannon|Heartbeat and ticket endpoints at 2x expected concurrency|



#### **Security test checklist** 

1. Student A cannot read or modify Student B's profile, progress or enrollments on any <mark>[id]</mark> endpoint (IDOR tests for every route). 

2. A student token receives 403 on every <mark>/api/admin/**</mark> route; an unauthenticated request receives 401. 

3. Expired, suspended or revoked enrollment: ticket returns 403, and active playback is terminated within one heartbeat. 

4. Second login revokes the first session; the first device is signed out within 15 seconds. 

5. Ticket replay, ticket from another IP prefix and expired ticket all fail and create <mark>ticket_replay</mark> events. 

6. **Automated leak scan:** crawl every student-visible page and JSON response and assert no 11-character YouTube ID or <mark>youtube.com</mark> URL appears, except inside the redeem response. 

7. Deleting, hiding, resizing or covering the watermark canvas stops playback and reports an event. 

8. Opening devtools (docked and undocked) in Chrome, Edge, Firefox and Safari desktop locks the player within about two seconds. 

9. Rate limits hold for login, ticket, heartbeat and event endpoints. 

10. Upload tests: wrong MIME, oversized, polyglot files and SVG scripts are rejected; images re-encoded. 

11. Stored XSS payloads in course description and student fields are sanitised or escaped. 

12. CSP report-only run shows no violations on the viewer; headers verified on all routes. 

13. Mobile playback and the iPhone fullscreen fallback work; watermark scales correctly. 

Confidential  -  Sarang Ventures 

Page 39 

LMS Technical Specification  |  Institute of Trading Tricks 

## **12. Deployment and Operations** 

### **12.1 Hostinger deployment steps** 

1. Create the Atlas project, database and a least-privilege user; set the network access rule (see 3.5); enable TLS. 

2. Generate secrets <mark>(NEXTAUTH_SECRET</mark> , <mark>TICKET_SECRET</mark> , <mark>CRON_SECRET</mark> , <mark>VIDEO_ENC_KEY</mark> ) and store them in hPanel environment variables; back up <mark>VIDEO_ENC_KEY</mark> offline. 

3. Create the Node.js web app in hPanel (current LTS Node), connect the Git repository or upload the build, set the start command to <mark>npm start</mark> . 

4. If building on the server runs out of memory, build in CI (for example GitHub Actions) and deploy the build output. 

5. Run <mark>npm run create-indexes</mark> and <mark>npm run seed:admin</mark> once. 

6. Connect the domain, enable SSL and force HTTPS; verify HSTS and all security headers. 

7. Add the cron jobs below; verify each with a manual run. 

8. Complete the go-live checklist (Appendix A) before inviting students. 

### **12.2 Scheduled jobs (hPanel cron)** 

|**Job**|**Schedule (Asia/Karachi)**|**Command**|
|---|---|---|
|**Expire enrollments**|Daily 00:05|curl -fsS -X POST -H "x-cron-secret: $CRON_SECRET"<br>https://DOMAIN/api/cron/expire-enrollments|
|**Rollups**|Daily 00:20|same,<br>/api/cron/rollups|
|**Cleanup (stale playback sessions,**|Daily 03:00|same,<br>/api/cron/cleanup|
|**purge)**|||
|**Backup export**|Daily 03:30|node scripts/backup.js(or Atlas backup after upgrade)|



### **12.3 Release and rollback** 

- Staging environment on a subdomain with a separate Atlas database; every release is tested there first. 

- Tag releases; keep the previous build for one-step rollback; schema changes are additive (new fields optional) so rollback never needs a data migration. 

- Dependency audit <mark>(npm audit</mark> ) and Dependabot updates reviewed monthly; YouTube player behaviour checked after any playback incident. 

Confidential  -  Sarang Ventures 

Page 40 

LMS Technical Specification  |  Institute of Trading Tricks 

## **13. Implementation Roadmap** 

|**Phase**|**Days**|**Deliverables**|**Acceptance**|
|---|---|---|---|
|**P0 Foundations**|3|Repo structure, TS/lint, Tailwind and shadcn theme, Mongo<br>connection helper, env handling, CI, model skeletons|App builds and deploys to<br>staging|
|**P1 Auth and RBAC**|4|NextAuth, sessions, guards, middleware, rate limiting, login<br>pages, seed admin|Role gating and single-device<br>test pass|
|**P2 Student**<br>**management**|5|CRUD, credentials, status, filters, bulk actions, CSV<br>import/export, student detail|Admin can manage students<br>end to end|
|**P3 Course catalogue**|8|Categories, authors, course builder, modules, lectures,<br>video link validation and encryption, reorder, duplicate|Full course created with<br>verified videos|
|**P4 Enrollment**|3|Enroll, expiry, drip, cron, access rules|Expiry and drip enforced<br>server-side|
|**P5 Student portal**|5|Dashboard, courses, course detail, settings, continue link|Student sees only own<br>content|
|**P6 Secure player**|8|Ticket flow, player shell, controls, watermark, tamper<br>monitor, devtools guard, scoring and response,<br>headers/CSP|Security checklist items 1-13<br>pass|
|**P7 Analytics**|6|Rollups, dashboards, student and course analytics, exports|Metrics match test data|
|**P8 Settings, audit,**<br>**polish**|3|Admin/student settings, audit log views, empty/error<br>states, accessibility pass|No open UX defects|
|**P9 QA and launch**|5|Cross-browser tests, load test, security review, deployment,<br>handover docs|Go-live checklist signed off|



**Total: about 50 working days** , roughly 10 weeks for one developer, or about 6 weeks with two developers working in parallel (admin catalogue in one stream; student portal and secure player in the other after P1). Estimates assume timely feedback and content from the client. 

##### **Alignment with the proposal** 

The signed proposal covers a smaller scope and states 6 weeks (its schedule table lists three). Analytics, the full antipiracy suite, categories/authors, device sessions and extended student profiles should be agreed through a change request before work on P6 and P7 begins. 

#### **Suggested release order** 

- **Release 1 (end of P5 plus a basic player):** admin and student core with enrollment and a working, authenticated player. 

- **Release 2 (end of P6):** full protection suite. Do not onboard real students before this. 

- **Release 3 (end of P9):** analytics, polish and handover. 

Confidential  -  Sarang Ventures 

Page 41 

LMS Technical Specification  |  Institute of Trading Tricks 

## **14. Risks and Open Decisions** 

### **14.1 Risk register** 

|**Risk**|**Impact**|**Mitigation**|
|---|---|---|
|**Content still leaks through recording or ID**<br>**extraction**|High|Set expectations (1.4); watermark and audit; rotation<br>playbook; DRM host upgrade path|
|**YouTube policy or player change breaks the**<br>**hardened embed**|High|Provider abstraction; monitor; fallback message; consider<br>a paid host|
|**Atlas M0 limits or data loss**|High|Index discipline, rollups, scheduled exports, upgrade<br>before scale|
|**Hostinger memory or process limits**|Medium|Lean queries, CI builds, avoid heavy libraries, monitor<br>usage|
|**Devtools detection false positives**|Medium|Multiple probes, consecutive hits, tuning flag, clear<br>unlock path|
|**Scope growth beyond the proposal**|Medium|Change request; phased releases|
|**Loss of**<br>**VIDEO_ENC_KEY**|High|Offline backup, documented rotation script|
|**Student frustration with strict controls**|Medium|Clear terms, helpful messages, configurable thresholds,<br>quick admin unlock|



### **14.2 Decisions needed from the client** 

1. Maximum devices per student (recommended: 1). 

2. Default access duration (lifetime, or for example 3, 6, 12 months). 

3. Whether students may edit their phone number (recommended: no). 

4. Whether the public intro video field is wanted on courses. 

5. How credentials are delivered (copy message, email via SMTP, or WhatsApp text). 

6. Acceptance of the YouTube policy risk, or budget for a DRM-capable host later. 

7. Phase 2 items: certificates, quizzes, Q&A, announcements, notifications. 

8. Expected number of students and concurrent viewers. 

9. Languages required (English only, or Urdu as well). 

10. Final text for terms of use and privacy policy shown on first login. 

Confidential  -  Sarang Ventures 

Page 42 

LMS Technical Specification  |  Institute of Trading Tricks 

## **Appendix A. Go-Live Security Checklist** 

|**#**|**Check**|**Done**|
|---|---|---|
|**1**|All secrets set in hPanel; none in the repository;<br>VIDEO_ENC_KEYbacked up offline||
|**2**|HTTPS enforced; HSTS, CSP, X-Frame-Options, Permissions-Policy verified||
|**3**|Admin seeded with a strong password; no default accounts||
|**4**|Atlas user has least privilege; network rule reviewed; backups tested||
|**5**|Leak scan (11-character ID and youtube.com URL) passes on all student pages and APIs||
|**6**|IDOR and role tests pass for every route||
|**7**|Devtools, tamper and watermark tests pass in all supported browsers||
|**8**|Rate limits and lock-out verified||
|**9**|YouTube videos all Unlisted, embedding on, on a dedicated 2FA account||
|**10**|Terms of use and privacy policy published; first-login acceptance works||
|**11**|Cron jobs running; health check monitored; error tracking active||
|**12**|Leak-response playbook rehearsed once (replace a video link end to end)||



Confidential  -  Sarang Ventures 

Page 43 

