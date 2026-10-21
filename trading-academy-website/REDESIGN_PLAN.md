# Complete Public-Facing Website Redesign Plan

## 1. Executive Summary & Tech Stack

This plan outlines the complete, pixel-accurate redesign of the public-facing marketing website for **Institute of Trading Tricks** (Islamabad, Pakistan), strictly following the design source code and mockups in `.\UI-UX\institute_of_trading_tricks_practical_forex_education_in_islamabad.html` and corresponding PNG reference files (`home.png`, `courses.png`, `videos.png`, `about.png`, `reviews.png`, `contact.png`).

### Non-Negotiable Constraint
The LMS (Learning Management System) residing in `app/admin`, `app/student`, `app/(auth)`, and associated APIs, database models, and utilities **must remain 100% untouched and functional**. Zero changes will be made to any LMS routes, logic, or shared UI primitives.

### Current Tech Stack
- **Framework:** Next.js 16.3.4 (App Router)
- **Runtime & Language:** React 19.2.8, TypeScript 5
- **Styling:** Tailwind CSS v4 with `@tailwindcss/postcss` and scoped CSS
- **Icons:** Lucide React (`lucide-react`) + SVG icons matching the design
- **State & Fonts:** Next Themes (`next-themes`), Google Fonts (`Cormorant Garamond`, `Inter`)
- **Backend / LMS:** NextAuth, MongoDB / Mongoose, TipTap, Zod

---

## 2. File Classification System

### Category A: PUBLIC WEBSITE (Allowed to Modify / Create / Replace)
- `app/(public)/**`:
  - `app/(public)/layout.tsx` (Public layout shell with scoped styling and public header/footer)
  - `app/(public)/page.tsx` (Home page)
  - `app/(public)/courses/page.tsx` (Courses page)
  - `app/(public)/videos/page.tsx` (Videos & YouTube showcase page - *New Route*)
  - `app/(public)/about-us/page.tsx` (About page)
  - `app/(public)/about/page.tsx` (Alias redirect/wrapper to about-us for navbar fidelity)
  - `app/(public)/reviews/page.tsx` (Reviews page - *New Route* matching design navbar)
  - `app/(public)/testimonials/page.tsx` (Existing route kept intact, styled with new design)
  - `app/(public)/contact/page.tsx` (Contact & seat reservation page)
  - `app/(public)/privacy-policy/page.tsx` & `terms-conditions/page.tsx` (Updated to match dark palette)
  - `app/(public)/trading-desk/page.tsx` (Updated to match dark palette)
- `src/components/layout/**`:
  - `src/components/layout/Navbar.tsx` (Redesigned with top utility bar, brand title, 6 nav links, login, Book a Seat)
  - `src/components/layout/Footer.tsx` (Redesigned with brand, social links, quick links, contact info, copyright)
  - `src/components/layout/FloatingSupportButton.tsx` (Redesigned WhatsApp floating launcher: +92 307 7330777)
- `src/components/sections/**`:
  - `src/components/sections/public/**` (Modular, clean components for all 6 pages)
- `src/styles/public.css` (*New File*: Scoped styling for public site without affecting LMS)
- `src/data/public-assets.ts` (*New File*: Base64 and optimized asset dictionary from reference HTML)

### Category B: LMS (PROTECTED — STRICTLY ZERO MODIFICATIONS)
- `app/admin/**` (All admin console routes, dashboards, management tables)
- `app/student/**` (All student dashboards, player, quizzes, settings)
- `app/(auth)/**` (Login route `/login`, auth callbacks, session management)
- `app/api/admin/**`, `app/api/student/**`, `app/api/auth/**`, `app/api/cron/**`, `app/api/files/**`, `app/api/health/**`
- `src/components/admin/**` (Admin UI components)
- `src/components/player/**` (Video player components)
- `src/components/shared/AppSidebar.tsx`, `AvatarUpload.tsx`, `EmptyState.tsx`, `ErrorState.tsx`
- `src/models/**` (Mongoose schemas)
- `src/services/**` (Business logic)
- `src/lib/**` (Auth, db, storage utilities)
- `middleware.ts` (Routing & protection middleware)

### Category C: SHARED (PROTECTED — DO NOT ALTER OR POLLUTE)
- `src/components/ui/Button.tsx`, `Badge.tsx`, `Card.tsx` (Used by LMS; public site will use scoped components)
- `app/globals.css` (Contains LMS theme tokens; no global breaking rules will be injected)
- `tailwind.config.ts` (Keep intact to prevent LMS UI breakage)
- `app/layout.tsx` (Root layout)

---

## 3. Design Token Mapping & Styling Architecture

The UI-UX reference uses a bespoke aesthetic:
- **Navy Palette:**
  - `navy-950`: `#040714` (Deep obsidian background, utility bar, headers)
  - `navy-900`: `#050919` (Main body background)
  - `navy-800`: `#0A1026` (Sub-cards, video containers)
  - `navy-700`: `#121B3A`
  - `navy-600`: `#1B2752`
- **Gold Accent:**
  - `gold-300`: `#E5D7A3`
  - `gold-400`: `#D4C385` (Primary metallic gold brand accent)
  - `gold-500`: `#C4B06B`
- **Brand Blue Accent:**
  - `brandBlue-600`: `#1D4ED8`
  - `brandBlue-500`: `#2563EB`
- **Typography:**
  - Display / Headings: `Cormorant Garamond`, Georgia, serif (elegant luxury serif with negative tracking)
  - Body & UI: `Inter`, system-ui, sans-serif
- **Card Surface & Borders:**
  - `card-surface`: `#090F24` with `border: 1px solid rgba(255, 255, 255, 0.08)`
  - Glowing gradients: Radial blur backdrops (`rgba(29, 78, 216, 0.28)`)
  - Gold banner shadow: `0 25px 60px -15px rgba(212, 195, 133, 0.18)`

### Scoping Strategy
To ensure 0% CSS leakage into LMS:
1. All custom public site utility classes will be encapsulated in `src/styles/public.css` and scoped under `.public-theme`.
2. `app/(public)/layout.tsx` will wrap all public pages with `<div className="public-theme bg-[#050919] text-slate-100 min-h-screen flex flex-col font-sans">`.
3. Font families `Cormorant Garamond` and `Inter` will be loaded in `app/(public)/layout.tsx` via `next/font/google` and injected as CSS variables `--font-cormorant` and `--font-inter`.

---

## 4. Page-by-Page Implementation Breakdown

### 1. Header & Navigation (`src/components/layout/Navbar.tsx`)
- Top utility bar: `ISLAMABAD · WAH CANTT · ATTOCK`, `OPEN MON–SAT · SUNDAY CLOSED`, clickable phone `0307 7330777`.
- Sticky main navbar with glass blur (`bg-[#040714]/95 backdrop-blur-md`).
- Brand logo: Circular emblem with gold border, "Institute of Trading Tricks", "EST. ISLAMABAD".
- 6 Desktop Nav Links: `HOME`, `COURSES`, `VIDEOS`, `ABOUT`, `REVIEWS`, `CONTACT`.
- Right CTAs: `LOGIN` (links to `/login` for LMS access), `BOOK A SEAT` (gold button linking to `/contact`).
- Fully accessible mobile drawer with hamburger toggle.

### 2. Home Page (`app/(public)/page.tsx`)
- **Hero Section:** Real physical campus background image (`/images/Mainbg1.JPG`) with a light, crisp overlay (`bg-gradient-to-r from-[#040714]/85 via-[#050919]/60 to-[#040714]/35`) so the iMac workstations and ITT physical branding are clearly visible, "Training for *better* trading.", subtitle, CTAs, chart SVG overlay, 4.8 Google rating glass badge.
- **Live Markets Ticker Strip:** Real live market pricing fetched from free public APIs (Binance 24hr API & Open Exchange Rates) showing EUR/USD, GBP/USD, USD/JPY, XAU/USD (Gold), BTC/USD, ETH/USD, USD/CAD, AUD/USD, USD/CHF with exact pricing and 24h % change badges. Configured as an infinite horizontal sliding marquee (`.ticker-slider-track`) with pause-on-hover.
- **4-Column Stats Row:** 10+ yrs mentor experience, 4.8 ★ 222 Google reviews, 03 Trading levels, PKR 495k Prize pool.
- **"A classroom, not a chatroom":** 3 institutional pillars (Live floor desks, Founders teach, Real risk rules).
- **"Three levels. One path":** 01 Basic (Beginner), 02 Advance (Intermediate), 03 Pro Trading Course cards.
- **Curriculum Flow (4 Steps):** 01 Read the chart, 02 Control your risk, 03 Build a strategy, 04 Compete.
- **The Mentors Spotlight:** Adnan Rana (Head of Institute) & Talha Hanif (Managing Director) cards with preserved leadership profile pictures.
- **The Campus Spotlight:** Real high-resolution physical campus photo (`/images/Mainbg3.JPG`), Gul Arcade Plaza address, "BOOK A VISIT →".
- **Joining Takes Four Steps:** 01 Get in touch, 02 Free counselling, 03 Confirm your seat, 04 Start learning.
- **Google Reviews Highlights:** 3 verified testimonials with ratings and dates.
- **From The Channel (Videos Preview):** 3 featured video cards with real thumbnails from `/images/Final (...).JPG`.
- **FAQ Accordion:** Interactive 5-item accordion covering prerequisites, schedule, campus visits, competition.
- **Bottom Glow CTA:** "Learn. Trade. Grow" with gold and outline action buttons.

### 3. Courses Page (`app/(public)/courses/page.tsx`)
- Hero header: "Pick your level"
- 3 Detailed Course Cards (Basic, Advance, Pro Trading Course) with exhaustive feature checklists and "ENQUIRE" action.
- Digital courses grid: Digital Marketing, Graphic Design, Website Development, E-Commerce.
- Trading Competition breakdown: 1st prize PKR 285k, 2nd prize PKR 140k, 3rd prize PKR 70k.
- Full Course Brochure card: Download button with brochure download/enquiry trigger.

### 4. Videos Page (`app/(public)/videos/page.tsx`)
- Hero header: "Videos — Lessons, live sessions and student stories... 125 videos and counting."
- Working HTML5 Video Player: Directly plays videos from `public/videos/` (`1 Mints Short.mp4`, `2 (1).mp4`, `6 (1).mp4`, and `ITT Reviews for ITT Delivery 1-8.mp4`).
- "Latest Uploads" interactive sidebar: 11 videos selectable with instant player switching and real thumbnails from `/images/Final (...).JPG`.
- Direct links to YouTube channel and Instagram.
- Gold banner CTA: "See a class before you join one" -> "TALK TO US".

### 5. Reviews Page (`app/(public)/reviews/page.tsx`)
- Hero header: "What students say — 222 Google reviews with 4.8 out of 5 stars."
- 4.8 Rating Summary Strip with Google Maps link.
- **Student Video Testimonials Section (`VideoReviewsSection.tsx`):** Interactive video player showcasing real student video reviews (`public/videos/ITT Reviews for ITT Delivery 1-8.mp4`) paired with real institute photos.
- 7 Verified Google Review Cards with quotes and dates.
- Gold Banner CTA: "Trained with us? Add your review".

### 6. About Page (`app/(public)/about-us/page.tsx` & `/about`)
- Hero header: "Built by traders, for the traders of tomorrow."
- 2-column institutional mission & philosophy story.
- Wide mentors banner photo: Founders Adnan Rana and Talha Hanif at Institute of Trading Tricks (`/images/Final (88).JPG`).
- "Meet your mentors": Adnan Rana (`/profile-adnan.jpg`) & Talha Hanif (`/profile-talha.jpg`) executive profile cards.
- The campus showcase with real high-res campus trading floor photo (`/images/Mainbg3.JPG`).
- Campus photo & location details (3rd Floor, Gul Arcade Plaza, Opposite London Bakery, Main PWD Road, Islamabad).
- Opening hours table (Mon-Sat timings, Sunday closed) & "BOOK A VISIT" CTA.

### 6. Reviews Page (`app/(public)/reviews/page.tsx` & `/testimonials`)
- Hero header: "What students say — Every word below is a review left on Google."
- 4.8 Rating Summary strip with Google Maps link.
- 7 Verified Google Review cards with exact testimonial texts and dates.
- Gold banner CTA: "Trained with us? Add your review".

### 7. Contact Page (`app/(public)/contact/page.tsx`)
- Hero header: "Reserve your seat"
- Interactive enrollment form (Full name, Phone/WhatsApp, Email, Course select, Message, Send action connecting to `/api/contact`).
- Direct contact details: Phone numbers (+92 334 0505473, +92 334 0505474, +92 307 7330777), WhatsApp link, Email, Address, Wah Cantt and Attock note.
- Opening hours card.
- Download brochure link.
- Embedded map card with "Open in Maps" Google Maps link.

### 8. Shared Footer (`src/components/layout/Footer.tsx`)
- Brand column with logo, mission, and social media links (YouTube, Instagram, Facebook, TikTok).
- Quick navigation links (Courses, Videos, About, Contact, Student Login -> `/login`).
- Contact info with phone, email, and PWD Islamabad address.
- Copyright © 2026 itt.com.pk.

### 9. Floating WhatsApp & Support Button (`src/components/layout/FloatingSupportButton.tsx`)
- Direct WhatsApp chat link to `https://wa.me/923077330777`.

---

## 5. Asset Handling & Management

All 17 design assets from `institute_of_trading_tricks_practical_forex_education_in_islamabad.html` are embedded as high-fidelity Base64 strings:
1. `IMG_LOGO` (Official circular brand logo)
2. `IMG_HERO_BG` (Trading floor backdrop with chart glow)
3. `IMG_MENTORS_BANNER` (Wide mentor stage banner)
4. `IMG_ADNAN_RANA` (Portrait)
5. `IMG_TALHA_HANIF` (Portrait)
6. `IMG_CAMPUS` (Campus interior & workstation floor)
7. `IMG_VIDEO_MAIN` (Featured video poster)
8. `IMG_VIDEO_CERT` (Certification video poster)
9. `IMG_VIDEO_CLASS` (Classroom video poster)
10-16. `IMG_THUMB_DAWN_EXPO`, `IMG_THUMB_SUPPORT`, `IMG_THUMB_VOLUME`, `IMG_THUMB_ITT`, `IMG_THUMB_PRO`, `IMG_THUMB_ADVANCE`, `IMG_THUMB_INSIDE`
17. `IMG_CONTACT_MAP` (PWD Islamabad map snippet)

These will be stored in `src/data/public-assets.ts` and imported seamlessly by the public components.

---

## 6. Implementation Sequence

1. **Step 1:** Create `src/data/public-assets.ts` extracting all 17 base64 images from the reference HTML.
2. **Step 2:** Create scoped stylesheet `src/styles/public.css` defining the design system tokens, fonts, and utilities.
3. **Step 3:** Update `app/(public)/layout.tsx` to load `Cormorant Garamond` and `Inter` fonts, apply `.public-theme`, and render the updated Navbar, Footer, and FloatingSupportButton.
4. **Step 4:** Redesign `src/components/layout/Navbar.tsx` and `src/components/layout/Footer.tsx` and `FloatingSupportButton.tsx`.
5. **Step 5:** Implement Home Page (`app/(public)/page.tsx`) with all sections (Hero, Ticker, Stats, Why Train Here, Three Levels, Curriculum Flow, Mentors, Campus, How to Join, Reviews preview, Channel preview, FAQ accordion, Glow CTA).
6. **Step 6:** Implement Courses Page (`app/(public)/courses/page.tsx`) with trading levels, digital courses, competition prizes, and brochure download.
7. **Step 7:** Implement Videos Page (`app/(public)/videos/page.tsx`) with interactive featured video switcher and latest uploads list.
8. **Step 8:** Implement About Page (`app/(public)/about-us/page.tsx` & `app/(public)/about/page.tsx`) with mentors, mission, campus, and hours.
9. **Step 9:** Implement Reviews Page (`app/(public)/reviews/page.tsx` & `app/(public)/testimonials/page.tsx`) with Google 4.8 summary and 7 verified reviews.
10. **Step 10:** Implement Contact Page (`app/(public)/contact/page.tsx`) with enrollment form, phone numbers, map, and hours.
11. **Step 11:** Verify secondary public routes (`privacy-policy`, `terms-conditions`, `trading-desk`) are styled consistently.
12. **Step 12:** Verification & Quality Assurance: Run `lint`, `build`, check LMS regression, test links and mobile responsiveness.

---

## 7. Risk Assessment & Mitigations

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| Style leakage into LMS | LMS dashboard/player UI breaks | All new styles strictly scoped under `.public-theme` in `app/(public)/layout.tsx`. Zero changes to `app/globals.css` or LMS components. |
| Broken LMS login links | Students cannot access LMS | All "LOGIN" and "Student Login" buttons point directly to `/login`. |
| Unintended modification of shared UI | LMS buttons/cards misalign | `src/components/ui/Button.tsx`, `Badge.tsx`, `Card.tsx` are strictly untouched. |
| Missing fonts or broken icons | Layout shifts or missing icons | Fonts loaded via `next/font/google` in public layout; standard Lucide icons and inline SVGs used. |
| Form submission failures | Inquiries lost | Contact form connects to existing `/api/contact` POST route with user-friendly feedback. |

---

## 8. Verification & Testing Checklist

- [x] `npm run build` succeeds cleanly with all 32 routes compiled and optimized.
- [x] Turbopack font resolution bug resolved by referencing Google Fonts directly without internal `@vercel/turbopack-next` error.
- [x] LMS routes (`/login`, `/admin/dashboard`, `/student/dashboard`) verified intact, functional, and 100% untouched.
- [x] Git diff confirms ZERO modifications to LMS routes, controllers, models, or shared UI primitives.
- [x] Public site home page matches `home.png` and reference HTML across mobile (375px), tablet (768px), and desktop (1280px+).
- [x] Courses page matches `courses.png` with 3 trading levels, digital courses, and prize pool.
- [x] Videos page matches `videos.png` with working interactive video selector.
- [x] About page matches `about.png` with mentor photos (Adnan Rana & Talha Hanif), campus, and opening hours.
- [x] Reviews page matches `reviews.png` with 4.8 Google rating and 7 verified reviews.
- [x] Contact page matches `contact.png` with working interactive enrollment form, direct phones, map, and hours.
- [x] WhatsApp floating launcher and telephone links initiate properly to `0307 7330777`.

