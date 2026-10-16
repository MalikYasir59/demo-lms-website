# Admin Enhancement Plan

> **Phase 2 — Detailed Implementation Plan**  
> **Based on:** LMS_COMPLETION_REPORT.md, LMS_IMPLEMENTATION_PLAN.md, LMS_UI_REDESIGN_REPORT.md  
> **Scope:** WP1–WP4 (Student Details, Course Categories/Authors, Lecture Editor, File Storage)  
> **Date:** 16 October 2026

---

## 1. Findings Summary

### 1.1 What Already Exists

| Area | Status | Key Files |
|---|---|---|
| **Student Detail Page** | Partially implemented | `app/admin/(console)/students/[id]/page.tsx` (1108 lines) — 4 tabs: overview, enrollments, sessions, audit |
| **Student PATCH API** | Exists with limited fields | `app/api/admin/students/[id]/route.ts`, `updateStudentSchema` (name, phone, profile, adminNotes) |
| **Enrollment API** | Exists and functional | `app/api/admin/students/[id]/enrollments/route.ts` (GET/POST), enrollment service fully implemented |
| **Security Events API** | **MISSING** | Route `security-events/route.ts` does not exist under `students/[id]/` |
| **Security Unlock API** | **MISSING** | Route `security/unlock/route.ts` does not exist |
| **Course Builder** | Fully implemented | `app/admin/(console)/courses/[id]/page.tsx` (1498 lines) — Details tab uses plain `<select>` for category/author |
| **Category/Author CRUD APIs** | Exist | `POST /api/admin/categories`, `POST /api/admin/authors` — create, list, delete |
| **Lecture Model** | Has `resources[]` schema | `src/models/Lecture.ts` — already has `resources[{title, fileKey, mime, size}]` |
| **Lecture API** | CRUD exists | `PATCH /api/admin/lectures/[id]`, `POST /api/admin/courses/[id]/lectures` |
| **Storage (`storage.ts`)** | **DOES NOT EXIST** | Not present in `src/lib/` |
| **Upload Image API** | Exists | `app/api/admin/uploads/image/route.ts` |
| **Shared Components** | AppSidebar, BrandLogo, ThemeQuickToggle, EmptyState, ErrorState, Providers | `src/components/shared/` |
| **UI Components** | Badge, Button, Card (PascalCase) | `src/components/ui/` |
| **Tiptap** | **NOT INSTALLED** | Not in `package.json` dependencies |
| **isomorphic-dompurify** | **NOT INSTALLED** | Not in `package.json` dependencies |
| **file-type** | **NOT INSTALLED** | Needed for magic-byte MIME sniffing |

### 1.2 Identified Bugs

#### **BUG #1: Enrollment Course List Empty** (WP1.2)
- **Root Cause:** `listCourses()` returns `{ items, page, limit, total, totalPages }` but the enrollment modal accesses `coursesData?.courses?.map()` (line 954 of student detail page). Since `courses` is undefined, no courses are shown.
- **Fix:** Change the query to correctly access `coursesData?.items` instead of `coursesData?.courses`.

### 1.3 Missing Features (Gaps)

| WP | Missing Feature |
|---|---|
| WP1.1 | Student page overview tab shows read-only cards, NOT editable form fields. No react-hook-form, no Zod validation, no dirty-state protection, no "Save Changes" button. Missing fields: `email` is not editable, `status` not editable inline. |
| WP1.2 | Enrollment dialog course list empty (bug above). No search in the course dropdown. No filtering of already-enrolled courses. |
| WP1.3 | Security/Audit tab only shows watermark info, NOT security events. No SecurityEvent fetch, no AuditLog merge, no filters, no pagination, no severity badges, no unlock button. The security-events API route doesn't exist. |
| WP2 | Category and Author fields are plain `<select>` dropdowns. No "create inline" functionality. No combobox/search. |
| WP3 | No dedicated lecture editor page. Lectures are created via a modal in the course builder. No rich-text editor for notes. No resource upload panel. No notesHtml field on Lecture model. |
| WP4 | No `storage.ts`, no `upload-limits.ts`, no StorageProvider abstraction, no file serving routes, no MIME sniffing, no streaming uploads. |

---

## 2. File-by-File Change List

### WP4 — Local File Storage (Foundation — implement first)

| Action | File | Details |
|---|---|---|
| **Create** | `src/lib/upload-limits.ts` | Single source of truth for allowed types, max sizes, max per lecture, max image dimensions |
| **Create** | `src/lib/storage.ts` | `StorageProvider` interface + `LocalDiskProvider` class |
| **Create** | `src/lib/mime-check.ts` | Magic-byte sniffing using `file-type` package |
| **Create** | `app/api/files/images/[...path]/route.ts` | Public image serving with long cache + nosniff |
| **Create** | `app/api/files/resources/[id]/route.ts` | Private resource serving with auth check |
| **Create** | `app/api/admin/uploads/file/route.ts` | Generic file upload endpoint |
| **Modify** | `.env.example` | Document `UPLOAD_DIR` |
| **Modify** | `package.json` | Add `file-type` dependency |

### WP1 — Admin Student Details

| Action | File | Details |
|---|---|---|
| **Rewrite** | `app/admin/(console)/students/[id]/page.tsx` | Full rewrite with react-hook-form, Zod, editable fields, security tab |
| **Modify** | `src/lib/validators/student.ts` | Add `email` to `updateStudentSchema` |
| **Modify** | `src/services/student.service.ts` | Handle email change with duplicate check |
| **Create** | `app/api/admin/students/[id]/security-events/route.ts` | GET with pagination, filters |
| **Create** | `app/api/admin/students/[id]/security/unlock/route.ts` | POST to reset security lock |

### WP2 — Course Category/Author Combobox

| Action | File | Details |
|---|---|---|
| **Create** | `src/components/admin/CreatableCombobox.tsx` | Reusable combobox component |
| **Modify** | `app/admin/(console)/courses/[id]/page.tsx` | Replace `<select>` with CreatableCombobox |
| **Modify** | `app/admin/(console)/courses/new/page.tsx` | Add Category and Author comboboxes |

### WP3 — Dedicated Lecture Editor Pages

| Action | File | Details |
|---|---|---|
| **Create** | `app/admin/(console)/courses/[id]/modules/[moduleId]/lectures/new/page.tsx` | Add lecture page |
| **Create** | `app/admin/(console)/courses/[id]/modules/[moduleId]/lectures/[lectureId]/page.tsx` | Edit lecture page |
| **Create** | `src/components/admin/TiptapEditor.tsx` | Rich-text editor component |
| **Create** | `src/components/admin/ResourceUploader.tsx` | Resource upload component |
| **Modify** | `src/models/Lecture.ts` | Add `notesHtml`, extend `resources[]` |
| **Modify** | `src/types/lms.ts` | Add `notesHtml` to ILecture, extend ILectureResource |
| **Modify** | `src/lib/validators/course.ts` | Extend lecture schemas |
| **Modify** | `app/admin/(console)/courses/[id]/page.tsx` | Navigate to editor pages |
| **Modify** | `package.json` | Add tiptap, dompurify deps |

---

## 3. Data Model Changes

All changes are backward-compatible (optional fields with defaults).

### Lecture Model Extensions

```typescript
// New optional field
notesHtml: { type: String, default: "" },

// Extended resources subdocument
resources: [{
  title: { type: String, required: true },
  fileKey: { type: String, required: true },
  originalName: { type: String, default: "" },   // NEW
  storedName: { type: String, default: "" },      // NEW
  mime: { type: String, default: "application/pdf" },
  size: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now },  // NEW
}]
```

---

## 4. API Changes

### New Routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/admin/students/[id]/security-events` | Paginated security events + audit logs |
| POST | `/api/admin/students/[id]/security/unlock` | Reset security lock and strikes |
| POST | `/api/admin/uploads/file` | Upload lecture resources |
| GET | `/api/files/images/[...path]` | Public image serving |
| GET | `/api/files/resources/[id]` | Private resource serving |

### Modified Routes

| Route | Change |
|---|---|
| `PATCH /api/admin/students/[id]` | Accept `email` field |
| `PATCH /api/admin/lectures/[id]` | Accept `notesHtml`, extended `resources[]` |

---

## 5. Storage Design

```
{UPLOAD_DIR}/
├── images/
│   ├── avatars/
│   ├── course-thumbnails/
│   └── lecture-images/
├── resources/
│   └── lectures/{lectureId}/
└── tmp/
```

---

## 6. Risk List

| # | Risk | Mitigation |
|---|---|---|
| R1 | Student page rewrite breaks existing functionality | Keep all mutations, extend with form |
| R2 | Email uniqueness conflict | Catch E11000, friendly error message |
| R3 | Tiptap bundle size | Dynamic import with next/dynamic, SSR: false |
| R4 | Video encryption unchanged | Zero modifications to crypto.ts or playback |
| R5 | File storage permissions | Auto-create with safe permissions |

---

## 7. Test Checklist

- [ ] Student page shows all fields, edits persist after refresh
- [ ] Save disabled when form clean; loading state on save
- [ ] Enrollment dialog lists available courses (BUG FIX)
- [ ] Security tab shows events with filters and summary
- [ ] Category/Author combobox with inline creation
- [ ] Lecture editor page with Tiptap, video, resources
- [ ] Files stored in UPLOAD_DIR, size limits enforced
- [ ] Private resources require authentication
- [ ] `tsc --noEmit`, lint, `npm run build` pass with 0 errors

---

## 8. Implementation Order

```
WP4 (Storage) → WP1 (Student Details) → WP2 (Combobox) → WP3 (Lecture Editor)
```
