# LMS Implementation Plan

> **Phase 2 — Software Architect**
> Based on `LMS_Technical_Specification.md` v1.0 and Phase 1 Codebase Analysis

---

## 1. Target Folder Structure

Existing files are marked with `(existing)`. Everything else is new.
Files are grouped by the work package (P0–P9) that creates them.

```
trading-academy-website/
├── .env.example                                    # P0
├── .gitignore                                      # (existing)
├── AGENTS.md                                       # (existing)
├── docs/
│   ├── LMS_IMPLEMENTATION_PLAN.md                  # P0 (this file)
│   └── LMS_COMPLETION_REPORT.md                    # P9
├── package.json                                    # (existing, updated)
├── next.config.ts                                  # (existing, updated P0+P6)
├── tailwind.config.ts                              # (existing, updated P0)
├── postcss.config.mjs                              # (existing)
├── tsconfig.json                                   # (existing)
├── eslint.config.mjs                               # (existing)
├── middleware.ts                                    # P1
│
├── app/
│   ├── globals.css                                 # (existing, extended P0)
│   ├── layout.tsx                                  # (existing, REFACTORED P0 → minimal shell)
│   ├── favicon.ico                                 # (existing)
│   │
│   ├── (public)/                                   # P0 — route group for marketing site
│   │   ├── layout.tsx                              # P0 — Navbar + Footer (moved from root)
│   │   ├── page.tsx                                # (existing, moved from app/page.tsx)
│   │   ├── about-us/                               # (existing, moved)
│   │   ├── contact/                                # (existing, moved)
│   │   ├── courses/                                # (existing, moved)
│   │   ├── privacy-policy/                         # (existing, moved)
│   │   ├── terms-conditions/                       # (existing, moved)
│   │   ├── testimonials/                           # (existing, moved)
│   │   └── trading-desk/                           # (existing, moved)
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx                          # P1 — student login
│   │   └── layout.tsx                              # P1 — auth layout (centered card)
│   │
│   ├── admin/
│   │   ├── login/page.tsx                          # P1 — admin login
│   │   ├── (console)/
│   │   │   ├── layout.tsx                          # P2 — sidebar + topbar shell
│   │   │   ├── dashboard/page.tsx                  # P7
│   │   │   ├── students/
│   │   │   │   ├── page.tsx                        # P2
│   │   │   │   ├── new/page.tsx                    # P2
│   │   │   │   └── [id]/page.tsx                   # P2
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx                        # P3
│   │   │   │   ├── new/page.tsx                    # P3
│   │   │   │   └── [id]/page.tsx                   # P3
│   │   │   ├── analytics/page.tsx                  # P7
│   │   │   └── settings/page.tsx                   # P8
│   │   └── loading.tsx                             # P2
│   │
│   ├── student/
│   │   ├── (portal)/
│   │   │   ├── layout.tsx                          # P5
│   │   │   ├── dashboard/page.tsx                  # P5
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx                        # P5
│   │   │   │   └── [courseId]/page.tsx              # P5
│   │   │   └── settings/page.tsx                   # P8
│   │   └── learn/
│   │       └── [courseId]/
│   │           └── [lectureId]/page.tsx             # P6
│   │
│   └── api/
│       ├── contact/route.ts                        # (existing)
│       ├── auth/[...nextauth]/route.ts             # P1
│       ├── health/route.ts                         # P0
│       ├── admin/
│       │   ├── dashboard/route.ts                  # P7
│       │   ├── students/
│       │   │   ├── route.ts                        # P2 (GET list, POST create)
│       │   │   ├── bulk/route.ts                   # P2
│       │   │   ├── import/route.ts                 # P2
│       │   │   ├── export/route.ts                 # P2
│       │   │   └── [id]/
│       │   │       ├── route.ts                    # P2 (GET, PATCH, DELETE)
│       │   │       ├── status/route.ts             # P2
│       │   │       ├── password/route.ts           # P2
│       │   │       ├── sessions/route.ts           # P2
│       │   │       ├── enrollments/route.ts        # P4
│       │   │       ├── progress/route.ts           # P5
│       │   │       ├── security-events/route.ts    # P6
│       │   │       └── security/unlock/route.ts    # P6
│       │   ├── courses/
│       │   │   ├── route.ts                        # P3 (GET list, POST create)
│       │   │   └── [id]/
│       │   │       ├── route.ts                    # P3 (GET, PATCH, DELETE)
│       │   │       ├── modules/
│       │   │       │   ├── route.ts                # P3
│       │   │       │   └── reorder/route.ts        # P3
│       │   │       ├── lectures/
│       │   │       │   ├── route.ts                # P3
│       │   │       │   └── reorder/route.ts        # P3
│       │   │       ├── publish/route.ts            # P3
│       │   │       ├── duplicate/route.ts          # P3
│       │   │       └── students/route.ts           # P4
│       │   ├── lectures/[id]/
│       │   │   ├── route.ts                        # P3
│       │   │   └── video/route.ts                  # P3
│       │   ├── modules/[id]/route.ts               # P3
│       │   ├── categories/route.ts                 # P3
│       │   ├── categories/[id]/route.ts            # P3
│       │   ├── authors/route.ts                    # P3
│       │   ├── authors/[id]/route.ts               # P3
│       │   ├── video/validate/route.ts             # P3
│       │   ├── enrollments/[id]/route.ts           # P4
│       │   ├── uploads/image/route.ts              # P3
│       │   ├── analytics/
│       │   │   ├── overview/route.ts               # P7
│       │   │   ├── students/route.ts               # P7
│       │   │   ├── students/[id]/route.ts          # P7
│       │   │   ├── courses/route.ts                # P7
│       │   │   ├── courses/[id]/route.ts           # P7
│       │   │   ├── engagement/route.ts             # P7
│       │   │   ├── security/route.ts               # P7
│       │   │   └── export/route.ts                 # P7
│       │   └── settings/route.ts                   # P8
│       ├── student/
│       │   ├── me/
│       │   │   ├── route.ts                        # P5 (GET, PATCH)
│       │   │   └── avatar/route.ts                 # P8
│       │   ├── dashboard/route.ts                  # P5
│       │   ├── courses/
│       │   │   ├── route.ts                        # P5
│       │   │   └── [courseId]/route.ts              # P5
│       │   ├── lectures/[lectureId]/route.ts       # P5
│       │   ├── playback/
│       │   │   ├── ticket/route.ts                 # P6
│       │   │   ├── redeem/route.ts                 # P6
│       │   │   ├── heartbeat/route.ts              # P6
│       │   │   └── end/route.ts                    # P6
│       │   ├── security/event/route.ts             # P6
│       │   ├── session/ping/route.ts               # P5
│       │   └── resources/[id]/route.ts             # P5
│       ├── public/
│       │   └── courses/route.ts                    # P3
│       └── cron/
│           ├── expire-enrollments/route.ts         # P4
│           ├── rollups/route.ts                    # P7
│           └── cleanup/route.ts                    # P6
│
├── src/
│   ├── components/
│   │   ├── layout/                                 # (existing, untouched)
│   │   ├── sections/                               # (existing, untouched)
│   │   ├── ui/                                     # (existing kept + shadcn added)
│   │   │   ├── Badge.tsx                           # (existing, untouched)
│   │   │   ├── Button.tsx                          # (existing, untouched)
│   │   │   ├── Card.tsx                            # (existing, untouched)
│   │   │   └── (shadcn components: lowercase)      # P0+
│   │   ├── admin/                                  # P2+
│   │   ├── student/                                # P5+
│   │   ├── player/                                 # P6
│   │   ├── charts/                                 # P7
│   │   └── shared/                                 # P0+
│   │
│   ├── lib/
│   │   ├── utils.ts                                # (existing, untouched)
│   │   ├── db.ts                                   # P0
│   │   ├── auth.ts                                 # P1
│   │   ├── auth-options.ts                         # P1
│   │   ├── guards.ts                               # P1
│   │   ├── api.ts                                  # P1
│   │   ├── errors.ts                               # P1
│   │   ├── crypto.ts                               # P3
│   │   ├── youtube.ts                              # P3
│   │   ├── tickets.ts                              # P6
│   │   ├── rate-limit.ts                           # P1
│   │   ├── security-score.ts                       # P6
│   │   ├── storage.ts                              # P3
│   │   ├── constants.ts                            # P0
│   │   └── validators/                             # P0+
│   │
│   ├── models/                                     # P1+
│   │   ├── User.ts, AuthSession.ts, RateLimit.ts   # P1
│   │   ├── AuditLog.ts                             # P2
│   │   ├── Category.ts, Author.ts, Course.ts,      # P3
│   │   │   Module.ts, Lecture.ts
│   │   ├── Enrollment.ts                           # P4
│   │   ├── LectureProgress.ts                      # P5
│   │   ├── PlaybackTicket.ts, PlaybackSession.ts,  # P6
│   │   │   SecurityEvent.ts
│   │   ├── DailyStat.ts, LectureStat.ts            # P7
│   │   └── Setting.ts                              # P8
│   │
│   ├── services/                                   # P2+
│   │   ├── student.service.ts, audit.service.ts    # P2
│   │   ├── course.service.ts                       # P3
│   │   ├── enrollment.service.ts                   # P4
│   │   ├── progress.service.ts                     # P5
│   │   ├── playback.service.ts, security.service.ts # P6
│   │   └── analytics.service.ts                    # P7
│   │
│   ├── security/                                   # P6
│   │   ├── devtools-guard.ts
│   │   ├── input-guard.ts
│   │   ├── watermark-engine.ts
│   │   ├── tamper-monitor.ts
│   │   ├── player-shell.tsx
│   │   └── yt-loader.ts
│   │
│   ├── data/                                       # (existing, untouched)
│   └── types/
│       ├── index.ts                                # (existing, untouched)
│       ├── lms.ts                                  # P0
│       └── next-auth.d.ts                          # P1
│
├── scripts/
│   ├── compress-images.js                          # (existing, untouched)
│   ├── compress_images.py                          # (existing, untouched)
│   ├── seed-admin.ts                               # P1
│   ├── create-indexes.ts                           # P0
│   └── backup.ts                                   # P8
│
├── tests/
│   ├── setup.ts                                    # P1
│   ├── helpers.ts                                  # P1
│   ├── unit/                                       # P2+
│   ├── integration/                                # P1+
│   └── e2e/                                        # P9
│
└── public/                                         # (existing, untouched)
```

---

## 2. Module Responsibility Matrix

| Module | Responsibility | Key Dependencies | Phase |
|---|---|---|---|
| **Foundation** | DB connection, env, TS types, constants, providers | mongoose, next-themes | P0 |
| **Auth** | NextAuth config, JWT+SID sessions, guards, middleware, rate limiting, login pages | next-auth, jose, bcryptjs | P1 |
| **Student Management** | Student CRUD, credentials, status, bulk actions, CSV, student detail UI | zod, react-hook-form, @tanstack/react-table | P2 |
| **Course Catalogue** | Categories, authors, courses, modules, lectures, video validation/encryption, reorder, course builder UI | dnd-kit, tiptap, crypto (node built-in) | P3 |
| **Enrollment** | Enroll/revoke, expiry, drip rules, cron job, access computation | — | P4 |
| **Student Portal** | Student dashboard, course list, course detail, progress tracking, continue link | @tanstack/react-query | P5 |
| **Secure Playback** | Ticket/redeem flow, player shell, YouTube IFrame API, watermark, tamper monitor, devtools guard, input guard, security scoring, CSP | jose, YouTube IFrame API | P6 |
| **Analytics** | Dashboard KPIs, charts, rollups, student/course/engagement/security analytics, CSV export | recharts | P7 |
| **Settings & Polish** | Admin/student settings, avatar upload, audit log views, empty/error states, accessibility | — | P8 |
| **QA & Launch** | E2E tests, security checklist, cross-browser, completion report | playwright, vitest | P9 |

---

## 3. Dependency List

### New Production Dependencies

| Package | Reason | Phase |
|---|---|---|
| `mongoose` | MongoDB ODM — spec requires Mongoose with TypeScript | P0 |
| `next-auth@5` | Authentication — spec requires NextAuth Credentials + JWT | P1 |
| `bcryptjs` | Password hashing — pure JS, safe on Hostinger (no native bindings) | P1 |
| `jose` | JWT signing/verification for playback tickets (separate from NextAuth) | P1 |
| `zod` | Shared validation schemas (client + server) | P0 |
| `react-hook-form` | Form state management | P2 |
| `@hookform/resolvers` | Zod resolver for react-hook-form | P2 |
| `@tanstack/react-query` | Client-side data fetching, mutations, optimistic updates | P2 |
| `@tanstack/react-table` | Server-paginated tables with sorting/filtering | P2 |
| `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` | Drag-and-drop for curriculum builder | P3 |
| `@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/extension-link` | Rich text editor for course descriptions | P3 |
| `isomorphic-dompurify` | HTML sanitization for rich text | P3 |
| `recharts` | Charts for analytics dashboards | P7 |
| `sonner` | Toast notifications | P2 |
| `next-themes` | Light/dark theme switching for LMS | P0 |
| `nanoid` | Short unique IDs for tickets and sessions | P1 |
| `ua-parser-js` | User agent parsing for device labels | P1 |
| `pino` | Structured JSON logging | P0 |

### New Dev Dependencies

| Package | Reason | Phase |
|---|---|---|
| `vitest` | Unit and integration testing | P1 |
| `mongodb-memory-server` | In-memory MongoDB for integration tests | P1 |
| `@playwright/test` | End-to-end testing | P9 |
| `@radix-ui/react-*` (via shadcn) | Accessible UI primitives | P0 |
| `tsx` | Run TypeScript scripts (seed-admin, create-indexes) | P0 |
| `class-variance-authority` | shadcn/ui component variants | P0 |

### Packages NOT Added (spec mentions but unnecessary or deferred)

| Package | Reason for Exclusion |
|---|---|
| `sentry` | Spec says "optional" — defer to post-launch |
| `javascript-obfuscator` | Spec says "raises effort only" — defer to P9 polish if time allows |
| `zxcvbn` | Password strength — will use a lightweight regex-based meter instead |
| `k6` / `autocannon` | Load testing — manual step in P9, not a project dependency |

---

## 4. Work Packages (P0–P9)

### P0: Foundations (Days 1–3)

**Objective:** Project structure, DB connection, theme system, build verification.

#### Files to Create/Modify

| Action | File | Details |
|---|---|---|
| **Refactor** | `app/layout.tsx` | Strip to minimal shell: html, body, fonts, Providers. No Navbar/Footer |
| **Create** | `app/(public)/layout.tsx` | Move Navbar + Footer + FloatingSupportButton + ambient glow here |
| **Move** | `app/page.tsx` → `app/(public)/page.tsx` | Plus all other public routes |
| **Create** | `src/lib/db.ts` | Cached Mongoose connection (global dev cache pattern) |
| **Create** | `src/lib/constants.ts` | App constants, error codes, role enums |
| **Create** | `src/lib/errors.ts` | ApiError class |
| **Create** | `src/lib/validators/common.ts` | Common Zod helpers (objectId, pagination, etc.) |
| **Create** | `src/types/lms.ts` | LMS TypeScript interfaces/types |
| **Create** | `src/components/shared/Providers.tsx` | QueryClientProvider, ThemeProvider, SessionProvider |
| **Create** | `app/api/health/route.ts` | Health check endpoint |
| **Create** | `scripts/create-indexes.ts` | MongoDB index creation script |
| **Create** | `.env.example` | All required env vars documented |
| **Update** | `package.json` | Add dependencies, scripts |
| **Update** | `tailwind.config.ts` | Extend content paths |
| **Update** | `app/globals.css` | Add LMS-specific CSS variables |
| **Update** | `next.config.ts` | Add YouTube image domains |

#### Acceptance Criteria
- [ ] App builds and starts without errors
- [ ] All existing public pages render exactly as before (Navbar, Footer, content)
- [ ] `GET /api/health` returns `{ ok: true }`
- [ ] MongoDB connects on first API call
- [ ] `.env.example` documents all variables
- [ ] No TypeScript or lint errors

#### Test Approach
- Manual: browse all public pages, compare visual output
- Unit: health endpoint returns 200
- Build: `npm run build` succeeds

---

### P1: Auth & RBAC (Days 4–7)

**Objective:** NextAuth with Credentials, JWT+SID sessions, role gating, rate limiting, login pages.

#### Files to Create

| File | Details |
|---|---|
| `src/models/User.ts` | Full schema per spec 4.3.1 |
| `src/models/AuthSession.ts` | Per spec 4.3.7 |
| `src/models/RateLimit.ts` | Per spec 4.3.7 |
| `src/lib/auth-options.ts` | NextAuth config with Credentials provider |
| `src/lib/auth.ts` | Session helpers, getIp, getUA |
| `src/lib/guards.ts` | requireAdmin, requireStudent |
| `src/lib/api.ts` | withApi wrapper per spec 6.2 |
| `src/lib/rate-limit.ts` | MongoDB-based rate limiter |
| `src/lib/validators/auth.ts` | Login schema |
| `src/types/next-auth.d.ts` | Type augmentations |
| `middleware.ts` | Role gate + security headers |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth route |
| `app/(auth)/layout.tsx` + `login/page.tsx` | Student login |
| `app/admin/login/page.tsx` | Admin login |
| `scripts/seed-admin.ts` | Seed first admin |
| `tests/setup.ts`, `helpers.ts`, `integration/auth.test.ts` | Test infrastructure |

#### Acceptance Criteria
- [ ] `npm run seed:admin` creates admin account
- [ ] Admin login at `/admin/login` → redirect to `/admin/dashboard`
- [ ] Student login at `/login` → redirect to `/student/dashboard`
- [ ] Wrong role redirected; unauthenticated redirected
- [ ] Rate limiting: 5 failed attempts → 15-min lockout
- [ ] Single-device: second login revokes first session
- [ ] JWT contains `role` and `sid`
- [ ] Public pages unaffected
- [ ] Integration tests pass

---

### P2: Student Management (Days 8–12)

**Objective:** Full student CRUD, credentials, status, bulk actions, CSV, admin console shell.

#### Key Deliverables
- Admin console layout (sidebar + topbar)
- Student list with server pagination, search, filters, sorting
- Create/edit student form with password generation
- Status management (activate, deactivate, suspend)
- Bulk actions (activate, deactivate, suspend, delete, export CSV)
- CSV import with dry-run validation
- Student detail page with tabs
- All `/api/admin/students/**` endpoints
- AuditLog model and service
- Shared components: DataTable, ConfirmDialog, EmptyState, ErrorState, PasswordField

#### Acceptance Criteria
- [ ] Admin can create student with generated/typed password (shown once)
- [ ] Full CRUD with search, filters, pagination, sorting
- [ ] Status changes work; suspend revokes sessions
- [ ] Bulk actions and CSV import/export
- [ ] Student detail page with Overview, Profile, Enrollments, Sessions tabs
- [ ] All endpoints follow `{ ok, data }` envelope
- [ ] Student tokens get 403 on all admin endpoints
- [ ] Audit log records admin actions

---

### P3: Course Catalogue (Days 13–20)

**Objective:** Categories, authors, course builder, modules, lectures, video encryption, reorder.

#### Key Deliverables
- Category and Author models and CRUD
- Course model with all fields per spec
- Module and Lecture models
- Video link validation (oEmbed) and AES-256-GCM encryption
- Course builder UI with 5 tabs (Details, Curriculum, Settings, Students, Preview)
- Curriculum builder with drag-and-drop (dnd-kit)
- Lecture editor (side sheet) with video link input
- Image upload and storage
- Rich text editor (Tiptap) for course descriptions

#### Acceptance Criteria
- [ ] Categories and authors CRUD with inline creation
- [ ] Course builder: title, slug, description, thumbnail, all settings
- [ ] Curriculum: modules + lectures with drag-and-drop reorder
- [ ] Video: paste → validate → encrypted storage; raw link never displayed
- [ ] `select: false` on `video.ref`; no video ID in any list response
- [ ] Publish readiness checks
- [ ] `/api/public/courses` returns published courses only (no video data)

---

### P4: Enrollment (Days 21–23)

**Objective:** Enrollment management, expiry, drip rules, cron.

#### Key Deliverables
- Enrollment model with effective access computation
- `hasAccess()` function per spec
- Drip rule evaluation (none, sequential, daysAfterEnroll, fixedDate)
- Enroll/extend/revoke from admin UI
- Expire-enrollments cron endpoint
- maxStudents cap enforcement

#### Acceptance Criteria
- [ ] Admin can enroll with start date and expiry
- [ ] `hasAccess()` correct for all edge cases
- [ ] Drip rules computed server-side
- [ ] Cron expires overdue enrollments
- [ ] maxStudents cap enforced (409)

---

### P5: Student Portal (Days 24–28)

**Objective:** Student dashboard, courses, course detail, progress, continue link.

#### Key Deliverables
- Student portal layout with top nav (desktop) / bottom tabs (mobile)
- Dashboard with stats, continue learning card, course grid
- Enrolled courses page with progress bars
- Course detail with module accordion and lecture status icons
- LectureProgress model and progress service (range merging)
- Student profile view/edit endpoints
- All `/api/student/**` endpoints (except playback)

#### Acceptance Criteria
- [ ] Dashboard: enrolled courses, lectures completed, hours watched, streak
- [ ] Continue learning links to correct lecture at resume point
- [ ] Course detail shows module/lecture tree with status icons (no video data)
- [ ] IDOR protection: student A cannot access student B's data
- [ ] Range merging correctly computes unique watched seconds

---

### P6: Secure Player (Days 29–36)

**Objective:** Complete Section 7 — ticket flow, player, watermark, tamper, devtools, scoring.

#### Key Deliverables
- PlaybackTicket, PlaybackSession, SecurityEvent models
- Ticket/redeem/heartbeat/end API flow
- Player shell with YouTube IFrame API (all UI hidden)
- Custom controls (play/pause, seek, volume, speed, fullscreen)
- Canvas watermark engine (9 positions, forensic tiling)
- Tamper monitor (canvas integrity checks)
- Devtools guard (size, timing, console probes)
- Input guard (blocked shortcuts, right-click, drag, select)
- Security scoring and response ladder
- CSP headers and nonce injection
- Viewer page with lock screen states
- Cleanup cron for stale sessions

#### Acceptance Criteria
- [ ] Ticket flow: full lifecycle per spec 7.4
- [ ] No video ID in any page/response except redeem
- [ ] Player: YouTube UI fully hidden; custom controls work
- [ ] Watermark: 3-line identity, moves randomly, forensic tiling
- [ ] Tamper: canvas removal/hiding detected → lock screen
- [ ] Devtools: detected within ~2s → iframe removed, lock screen
- [ ] Security scoring: 7-day rolling, response ladder enforced
- [ ] CSP headers correct
- [ ] allowSeekAhead enforcement
- [ ] Heartbeat validates enrollment/session on every call

---

### P7: Analytics (Days 37–42)

**Objective:** Dashboard KPIs, rollup cron, analytics tabs, charts, CSV export.

#### Key Deliverables
- DailyStat and LectureStat models
- Rollup cron endpoint
- Admin dashboard with KPI cards and charts
- Analytics page with 5 tabs (Overview, Students, Courses, Engagement, Security)
- Chart components (Recharts wrappers)
- CSV export (streaming)

#### Acceptance Criteria
- [ ] Dashboard KPIs: students, courses, enrollments, watch hours, completion, expiring, alerts
- [ ] Charts render with data
- [ ] Rollup cron aggregates correctly and idempotently
- [ ] Analytics tabs with date range filtering
- [ ] CSV export downloads

---

### P8: Settings, Audit & Polish (Days 43–45)

**Objective:** Settings pages, audit views, empty/error states, accessibility.

#### Key Deliverables
- Admin settings (profile, password, sessions, platform)
- Student settings (profile, avatar)
- Setting model
- loading.tsx and error.tsx for all routes
- Backup script

#### Acceptance Criteria
- [ ] Admin can change password (requires current), manage sessions
- [ ] Student sees read-only identity fields, can edit allowed fields and avatar
- [ ] Every page has loading skeleton and error boundary
- [ ] Keyboard navigation and focus rings work
- [ ] Responsive: admin on tablet, student mobile-first

---

### P9: QA & Launch (Days 46–50)

**Objective:** Full test suite, security checklist, completion report.

#### Security Checklist (Spec Section 11)

| # | Test |
|---|---|
| 1 | IDOR: Student A cannot read/modify Student B on any endpoint |
| 2 | Student token gets 403 on every `/api/admin/**` route |
| 3 | Expired enrollment: ticket returns 403, playback terminated within one heartbeat |
| 4 | Second login revokes first; first device out within 15s |
| 5 | Ticket replay/foreign IP/expired all fail with events |
| 6 | Leak scan: no YouTube ID in any student page/response except redeem |
| 7 | Watermark canvas tampering stops playback |
| 8 | Devtools locks player in Chrome/Edge/Firefox/Safari |
| 9 | Rate limits hold on all critical endpoints |
| 10 | Upload: wrong MIME/oversized/polyglot rejected |
| 11 | XSS payloads sanitized |
| 12 | CSP no violations on viewer |
| 13 | Mobile playback + iPhone fullscreen + watermark scaling |

#### Acceptance Criteria
- [ ] All automated tests pass
- [ ] Security checklist verified
- [ ] Cross-browser verified
- [ ] Public website unchanged
- [ ] `LMS_COMPLETION_REPORT.md` produced

---

## 5. Deviations from the Spec

| # | Spec Says | Plan Does | Reason |
|---|---|---|---|
| D1 | Folder structure under `src/app/` | Pages under `app/` | Match existing codebase convention |
| D2 | `zxcvbn` for password strength | Lightweight regex-based meter | Avoid 800KB+ dependency |
| D3 | Source obfuscation | Deferred post-launch | Spec rates it "raises effort only" |
| D4 | `Sentry` integration | Deferred post-launch | Spec says "optional" |
| D5 | shadcn components lowercase | Both coexist with existing PascalCase | Different files, unambiguous imports |

---

## 6. Risk Mitigation

| Risk | Mitigation | Phase |
|---|---|---|
| Root layout refactor breaks public site | Do first in P0; visual comparison | P0 |
| Next.js 16 + next-auth v5 compat | Test immediately in P1 | P1 |
| Tailwind v4 + shadcn/ui | Init early in P0, verify | P0 |
| MongoDB M0 performance | lean(), projections, indexes from day one | P0+ |
| Video ID leak | Automated scan, `select: false` | P3+P9 |

---

## 7. Implementation Order

```
P0 ─── Foundations
 └─ P1 ─── Auth & RBAC
     └─ P2 ─── Student Management
         └─ P3 ─── Course Catalogue
             └─ P4 ─── Enrollment
                 └─ P5 ─── Student Portal
                     └─ P6 ─── Secure Player
                         └─ P7 ─── Analytics
                             └─ P8 ─── Settings & Polish
                                 └─ P9 ─── QA & Launch
```

---

> **⏸️ Awaiting approval before implementation begins.**
>
> Reply "approved" to start Phase 3 (P0: Foundations).
