---
name: Obsidian Apex
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e0e2eb'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e0e2eb'
  inverse-on-surface: '#2d3037'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#10131a'
  on-background: '#e0e2eb'
  surface-variant: '#32353c'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-numeric:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0em
  label-telemetry:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-tag:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an elite, institutional-grade trading terminal aesthetic that rejects the tired, monochromatic blue dashboards of legacy enterprise fintech. It is engineered for proprietary trading desks, quantitative analysts, and discerning institutional investors who require rapid visual ingestion, precision telemetry, and uncompromised authority.

The aesthetic philosophy fuses **Hyper-Refined Glassmorphism** with **Technical Minimalism**:
- **Tactile Visual Precision:** Instrument-grade typography, razor-thin luminous perimeter borders, and deep optical hierarchy designed to eliminate cognitive drag during high-frequency execution.
- **Controlled Luminescence:** Strategic atmospheric backlight radial gradients and phosphorescent glow fields direct visual priority to mission-critical metrics without causing screen fatigue.
- **Multi-Chromatic Distinction:** Intentional chromatic bifurcation separates operational execution (Electric Indigo/Violet), alpha validation (Crisp Mint/Emerald), and institutional tier status (Burnished Gold/Amber).

## Colors

The chromatic architecture departs from flat, low-contrast dark palettes by establishing a strict multi-tier dark obsidian foundation paired with high-dynamic-range functional accents.

### Foundations & Surfaces
- **Canvas / Lowest Surface (`#080B11`):** Absolute floor for the workspace viewport.
- **Surface Baseline (`#0B0F17`):** Base structural layer for panel backdrops and table wrappers.
- **Surface Container Low (`#121824`):** Secondary container nesting, docked panes, and header bars.
- **Surface Container High (`#182234`):** Interactive card hulls, raised panels, active rows, and dropdown flyouts.

### Functional Accents
- **Primary / Execution (`#6366F1` to `#4F46E5`):** Royal Indigo & Electric Violet reserve exclusivity for primary execution controls, active trade signals, and terminal-level primary actions. Pair with `rgba(99, 102, 241, 0.25)` drop shadows to achieve luminous depth.
- **Secondary / Alpha & Verification (`#10B981` to `#059669`):** Crisp Mint & Emerald designate verified returns, live audit state markers, positive delta changes, and automated execution health.
- **Tertiary / Sovereign Tier (`#F59E0B` to `#D97706`):** Premium Amber & Burnished Gold denote institutional clearance tiers, high-value asset badges, algorithmic milestone unlocks, and high-impact telemetry warnings.

### Typography & Structure
- **Headings / Hero Data:** `#FFFFFF` (Solid dynamic clarity).
- **Subheadings / Secondary Values:** `#E2E8F0` (Slate-200, crisp legibility).
- **Body / Descriptive Copy:** `#94A3B8` (Slate-400, neutral dampening).
- **Muted / Telemetry Labels:** `#64748B` (Slate-500, structural framing).
- **Subtle Glass Borders:** Gradients shifting from `rgba(255, 255, 255, 0.08)` to `rgba(99, 102, 241, 0.20)`.

## Typography

The type scale relies exclusively on **Plus Jakarta Sans**, tuned for high-density transactional environments.

### Numeric & Metric Precision
- Every numeric figure, trade ledger output, order book rate, and delta timestamp must leverage `font-feature-settings: "tnum" on, "cv05" on, "zero" on`. This activates tabular figures, preventing layout jank during live data streams while distinguishing between zero and uppercase 'O'.

### Hierarchical Treatment
- **Display & Headlines:** Heavy weights (`700` and `600`) with tightened negative letter-spacing (`-0.01em` to `-0.03em`) to anchor panel sections and primary equity values.
- **Telemetry & Section Eyebrows:** Styled with `label-telemetry`—strict uppercase transform, letter-spacing set to `+0.08em`, and muted slate coloration for unambiguous categorical segregation.

## Layout & Spacing

The spatial architecture supports continuous real-time data inspection using a strictly controlled 4px-baseline modular scale.

### Workspace Grid Structure
- **Desktop (1440px+):** 12-column adaptive layout, variable pane docks with `1.5rem` (`24px`) gutters and `2rem` (`32px`) margins. Supports modular drag-and-drop workspace tiling.
- **Tablet / Laptop (1024px – 1439px):** 8-column layout, `1rem` (`16px`) gutters. Auxiliary toolbars collapse into sliding trays.
- **Mobile (< 1023px):** Single-column stacked stream, 4-column sub-grids, `1rem` outer canvas padding. Complex metrics collapse into horizontal scroll pills and swipeable card decks.

### Layout Principles
- Density takes precedence over excessive whitespace. Structural containers rely on `space-sm` (`8px`) to `space-md` (`16px`) interior padding to maximize above-the-fold telemetry visibility.
- Layout blocks must maintain crisp vertical boundaries using container tiers and perimeter strokes rather than excessive empty buffer distance.

## Elevation & Depth

Visual depth eschews generic solid dropshadows in favor of **Tonal Stratification, Glass Luminance, and Atmospheric Lighting**.

### Depth Layers
1. **Floor 0 (Background):** `#080B11` with localized radial glow fields:
   - Primary focal glow: `radial-gradient(ellipse at top right, rgba(99, 102, 241, 0.08) 0%, transparent 65%)`.
   - Alpha highlight: `radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.05) 0%, transparent 50%)`.
2. **Floor 1 (Panels & Canvases):** `#0B0F17` at 85% opacity with `backdrop-filter: blur(16px)`. Enclosed by a 1px solid border of `rgba(255, 255, 255, 0.06)`.
3. **Floor 2 (Floating Cards & Flyouts):** `#121824` at 92% opacity with `backdrop-filter: blur(24px)`. Outer border utilizes a directional gradient: `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(99, 102, 241, 0.20) 100%)`.
4. **Floor 3 (Active Overlays & Modals):** `#182234` solid surface accompanied by an ambient execution shadow: `0 20px 48px -12px rgba(0, 0, 0, 0.75), 0 0 24px 0 rgba(99, 102, 241, 0.15)`.

## Shapes

The design system employs a **Soft (`1`)** shape language to reinforce mechanical engineering precision and maximize space utilization on dense analytics screens.

### Radius Distribution
- **Cards, Chart Panels, Modals:** `rounded-lg` (`0.5rem` / `8px`). Keeps large modular panels crisp and geometric.
- **Buttons, Form Inputs, Filter Containers:** `rounded` (`0.25rem` / `4px`). Sharp tactile corner radii suited for swift cursor targeting.
- **Pills, Tickers, Live Status Indicators:** Complete capsule radius (`rounded-full`) exclusively reserved for dynamic state badges, pill tags, and quick-toggle chips.

## Components

### Buttons & Interactive Controls
- **Primary Execution Button:** Gradient fill (`linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)`), text color `#FFFFFF`, border `1px solid rgba(255, 255, 255, 0.20)`. Hover states introduce an outer luminous aura (`box-shadow: 0 0 16px rgba(99, 102, 241, 0.45)`).
- **Secondary / Panel Button:** Background `#182234`, text color `#E2E8F0`, border `1px solid rgba(255, 255, 255, 0.08)`. Hover transitions border to `rgba(99, 102, 241, 0.40)` with text brightening to pure white.
- **Ghost Action:** Background transparent, text `#94A3B8`. Hover introduces background `#121824` and text `#FFFFFF`.

### Badges & Telemetry Chips
- **Profit / Live Audit Verified Badge:** Background `rgba(16, 185, 129, 0.10)`, text `#10B981`, border `1px solid rgba(16, 185, 129, 0.30)`. Includes a pulse point using an active pinging emerald dot.
- **Institutional Tier / Sovereign Milestone:** Background `rgba(245, 158, 11, 0.10)`, text `#F59E0B`, border `1px solid rgba(245, 158, 11, 0.30)`. Accompanied by Amber accent micro-icons.
- **Category Filter Chips:** Capsule shaped, background `#0B0F17`, border `1px solid rgba(255, 255, 255, 0.06)`, text `label-telemetry`. Active selection turns background to `rgba(99, 102, 241, 0.15)` with a solid `#6366F1` 1px border.

### Input Fields & Controls
- **Terminal Inputs:** Background `#080B11`, border `1px solid rgba(255, 255, 255, 0.10)`, text `#FFFFFF`, caret `#6366F1`. Internal typography set to `label-numeric`. Focus state delivers a continuous `1px solid #6366F1` border coupled with `0 0 8px rgba(99, 102, 241, 0.30)`.
- **Selection Checkboxes & Switches:** Unchecked borders set to `rgba(255, 255, 255, 0.20)` against `#0B0F17`. Checked states trigger fill `#6366F1` with white SVG icons.

### Data Cards & Tables
- **Trading Metric Card:** Background `#0B0F17` at 90% opacity, glass blur `20px`, enclosed in the signature dual-gradient 1px perimeter border. Top border contains an ultra-thin 1px inner highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.10)`).
- **Tabular Ledger:** Alternating rows use transparent vs `rgba(24, 34, 52, 0.35)`. Row hover triggers `rgba(99, 102, 241, 0.08)` fill with a distinct 2px left border accent in `#6366F1`. All values right-aligned using `label-numeric`.

