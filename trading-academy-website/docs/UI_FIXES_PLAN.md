# UI Polishing & Accessible Application Shell Architecture Plan

**Document Version:** 1.0.0  
**Target Environment:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, next-themes  
**Scope:** Avatar Cropper Precision (Task 1), Sidebar Theme Selector Removal (Task 2), Accessible Collapsible Application Shell (Task 3)  

---

## 1. Executive Summary

This plan details the front-end engineering corrections required to elevate the "Institute of Trading Tricks" (ITT) LMS to institutional UX quality:
1. **Task 1 — Zero-Zoom Contained Avatar Cropper:** Resolve the pre-zoomed, misaligned avatar crop modal by scaling uploaded images to fit completely within the crop boundary on initialization (`object-contain` baseline), supporting fine-grained zoom controls, bounded drag/pinch gestures, SVG cutout masking, and exact WYSIWYG canvas export.
2. **Task 2 — Clean Sidebar Footer:** Eliminate the redundant appearance selector from the sidebar footer in both the Admin Console and Student Portal shells without affecting theme switching capabilities in Settings or topbars.
3. **Task 3 — Institutional Collapsible Sidebar Shell:** Upgrade the shared `AppSidebar` with smooth desktop expansion/collapse (`>= lg`), keyboard shortcut (`Ctrl/Cmd + B`), accessible ARIA states, persistent localStorage preference, icon-rail tooltips, chart reflow triggers, and an accessible mobile/tablet off-canvas drawer (`< lg`) with focus trapping and body scroll locking.

---

## 2. Root Cause Analysis: Avatar Crop Issue (Task 1)

Detailed code inspection of `src/components/shared/AvatarUpload.tsx` revealed multiple compounding flaws:

1. **Cover Scaling Flaw (`Math.max` vs `Math.min`):**
   - In `applyCropAndUpload`, the calculation used `baseScale = Math.max(cropAreaSize / drawWidth, cropAreaSize / drawHeight)`.
   - `Math.max` forces `object-fit: cover` behavior. For any non-square image (such as landscape 16:9 or portrait 9:16), one axis is immediately magnified and cropped outside the viewport before the user touches any control.
2. **Unconstrained Preview Element:**
   - In the modal JSX, `<img className="max-w-none ...">` had no explicit base dimensions. The preview element rendered at its raw pixel size inside a relative container, making large high-resolution images appear massively zoomed in.
3. **Mismatched Geometry Between Preview Mask and Canvas Export:**
   - The viewport container was `280x280px`, but the circular guide was styled with `width: 240px; height: 240px`.
   - The canvas export formula scaled by `canvasSize / 280` (`512 / 280`), exporting the 280px square rather than the 240px circular crop circle. This introduced an unexpected zoom-in and framing shift in the saved avatar compared to what the user previewed.
4. **Zoom Baseline Misrepresentation:**
   - The slider ranged from `min="1"` to `max="3"`, but `1` represented the already-magnified `cover` scale rather than natural containment. Users could not zoom out to view or select the whole image.

---

## 3. Detailed Technical Solutions

### 3.1 Task 1: Contained, Bounded, WYSIWYG Avatar Cropper
1. **Contained Initial State (Zero Zoom):**
   - Let circular crop diameter be $D = 240\text{ px}$ inside a $280 \times 280\text{ px}$ viewport.
   - For an image of dimensions $W \times H$, compute natural containment scale:
     $$scale_{fit} = \min\left(\frac{D}{W}, \frac{D}{H}\right)$$
   - At baseline (`zoom = 1.0` or display `100%`), the image's largest dimension matches $D$, and the other dimension is $\le D$. The entire photo is 100% visible inside the circle with zero pre-cropping.
   - For small images ($W < D$ and $H < D$), display at $1.0\times$ without blurry upscaling, with a helpful tooltip.
2. **Interactive Controls:**
   - Range: `1.0` (100% natural fit) to `3.5` (350% magnification).
   - Step: `0.02` for fine control.
   - Controls: Slider + discrete `−` / `+` step buttons + keyboard arrow navigation.
   - "Reset" button to instantly restore `zoom = 1.0` and `pan = { x: 0, y: 0 }`.
3. **Gestures & Panning Bounds:**
   - Support mouse dragging, touch single-finger dragging, two-finger pinch-to-zoom, and mouse wheel zooming.
   - Bound panning to prevent the image from being dragged away from the circular aperture:
     $$|pan_x| \le \max\left(0, \frac{W \cdot scale_{fit} \cdot zoom - D}{2}\right) + \frac{D}{4}$$
4. **Clear Circular Mask Overlay:**
   - Use an SVG cutout mask with `fill="black" fillOpacity="0.65"` and a circular punch-hole ($r = 120\text{ px}$) plus a crisp primary ring. Outside the circle is dimmed; inside is bright and clear.
5. **Mathematical WYSIWYG Export:**
   - Export to a $512 \times 512\text{ px}$ canvas.
   - Multiplier $M = 512 / D = 512 / 240$.
   - Canvas image dimensions: $W_{canvas} = W \cdot scale_{fit} \cdot zoom \cdot M$.
   - Canvas image position: $X_{canvas} = 256 + pan_x \cdot M - W_{canvas} / 2$.
   - Exact mathematical 1:1 match to the circular preview.

### 3.2 Task 2: Sidebar Appearance Selector Removal
1. **Removal in `AppSidebar.tsx`:**
   - Remove `<ThemeToggle variant="inline" />` from the desktop sidebar footer.
   - Remove `<div className="flex items-center justify-between px-1 pt-1"><span ...>Appearance</span><ThemeToggle ... /></div>` from the mobile drawer.
   - Clean up unused spacing, wrappers, and unused imports.
2. **Verification of Retention in Settings & Topbars:**
   - Verify `ThemeSelector` remains active in `/admin/settings` (Appearance tab) and `/student/settings` (Appearance & Theme Mode section).
   - Verify `ThemeToggle` remains active in the Admin Console topbar.

### 3.3 Task 3: Professional Collapsible Application Shell
1. **Breakpoint Standardization:**
   - Standardize to `lg` (`1024px`): Desktop is `lg:flex`, Mobile/Tablet is `< lg` (`lg:hidden`).
2. **Desktop Shell (`>= lg`):**
   - Toggle button with panel/chevron icon in header or sidebar boundary.
   - Keyboard shortcut: `Ctrl+B` / `Cmd+B` with tooltip hint.
   - Expanded state: width `260px` (`w-[260px]`), full logo, labels with smooth opacity transition.
   - Collapsed state: width `70px` (`w-[70px]`), compact crest logo, centered icons, tooltips on hover (`role="tooltip"`), highlighted active state, compact avatar.
   - Smooth transition: `transition-[width] duration-300 ease-in-out` with reduced-motion support.
   - Chart/Table reflow: dispatch `window.dispatchEvent(new Event("resize"))` on transition end.
   - Persistence: SSR-safe hydration with `localStorage.getItem("itt_sidebar_collapsed_${role}")`.
3. **Mobile Shell (`< lg`):**
   - Full off-canvas drawer with backdrop overlay.
   - Body scroll locking (`overflow: hidden` on `document.body` while open).
   - Focus trapping with focus return to the hamburger trigger on close.
   - Close on `Escape` key, backdrop click, or route change.
   - Always fully expanded on mobile (no icon rail).
4. **Layout Synchronization:**
   - Update `app/admin/(console)/layout.tsx` and `app/student/layout.tsx` to use `lg:flex-row` and `lg:hidden` topbars.

---

## 4. File-by-File Change Plan

| File Path | Action | Description |
| :--- | :--- | :--- |
| `src/components/shared/AvatarUpload.tsx` | Rewrite Cropper | Implement zero-zoom natural containment, SVG circular mask, bounded panning, wheel/pinch zoom, step buttons, reset button, and exact WYSIWYG canvas export. |
| `src/components/shared/AppSidebar.tsx` | Refactor | Remove appearance selector from footer, upgrade desktop collapse/expand with `Ctrl+B`, icon-rail tooltips, resize event dispatch, and accessible mobile drawer with scroll lock and focus trap. |
| `app/admin/(console)/layout.tsx` | Edit | Align breakpoint to `lg`, ensure main content container resizes smoothly with sidebar. |
| `app/student/layout.tsx` | Edit | Align breakpoint to `lg`, ensure main content container resizes smoothly with sidebar. |

---

## 5. Risk Analysis & Mitigations

| Risk | Mitigation |
| :--- | :--- |
| **Canvas export differs from circle preview on non-square images** | Use unified scale factor $M = 512 / D$ applied directly to UI transform coordinates. |
| **Hydration mismatch on persistent sidebar state** | Initialize collapsed state from `localStorage` within `useEffect` or safe client store. |
| **Charts or wide tables do not resize when sidebar collapses** | Dispatch `window.dispatchEvent(new Event("resize"))` on transition end so Recharts and tables recalculate dimensions. |
| **Focus lost on mobile drawer close** | Store `triggerRef` and call `.focus()` when drawer closes. |

---

## 6. Test & Verification Checklist

- [ ] Upload landscape photo (e.g. 16:9): whole image visible at 100%, centered, with no cut-off.
- [ ] Upload portrait photo (e.g. 9:16): whole image visible at 100%, centered, with no cut-off.
- [ ] Upload small image (< 240px): centered, not over-scaled without notice.
- [ ] Zoom in/out, pan, and reset buttons work smoothly.
- [ ] Canvas export exactly matches circular preview without shift or extra zoom.
- [ ] Appearance selector removed from sidebar footer in admin and student portals.
- [ ] Theme can still be changed from `/admin/settings` and `/student/settings`.
- [ ] Desktop sidebar collapses/expands with button and `Ctrl+B` / `Cmd+B`.
- [ ] Collapsed sidebar shows accessible tooltips and compact logo.
- [ ] Charts/tables reflow smoothly on sidebar toggle.
- [ ] Mobile drawer opens/closes cleanly with scroll lock, `Esc`, backdrop click, and focus return.
- [ ] `tsc --noEmit`, ESLint, and `next build` pass with 0 errors.
