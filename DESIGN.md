# PixelRing As-Built Visual Design System Spec (DESIGN.md)

This document maps the exact visual language, CSS tokens, layout grids, typography rules, and premium aesthetic highlights implemented across the main **PixelRing Reparatur** website. It serves as a single source of truth for developers creating new pages, features, or modules.

---

## 1. Core Color Palette

The PixelRing brand uses a carefully curated, harmonious palette of warm, natural editorial colors and deep technical slate-blues, entirely avoiding generic stark black/white or flat gray schemes.

### 1.1 Primary & Semantic Colors

| Token Name | Hex Code | Usage Context | Class Examples |
| :--- | :--- | :--- | :--- |
| **Deep Dark Navy** | `#0D1B2A` / `#0E1A2B` | Core headings, primary dark section backgrounds, key borders, and dark inputs. Represents stability and trust. | `bg-[#0D1B2A]`, `text-[#0E1A2B]` |
| **Accent Terracotta** | `#B8643E` | PixelRing primary brand color. Active CTAs, primary buttons, status badges, divider lines, and accent marks. | `bg-[#B8643E]`, `text-[#B8643E]` |
| **Accent Orange Hover**| `#A65835` | Interactive hover states for primary buttons and CTAs. | `hover:bg-[#A65835]` |

### 1.2 Background Tones

*   **Soft Slate Blue Background (`#EEF3FB`)**: Soft cool tint used at the top of the website (e.g., Hero Section) to make the first screen welcoming and highly professional.
*   **Warm Editorial Beige Background (`#F9F6F2`)**: Warm, premium, magazine-style cream shade used in dense content areas (FAQ, reviews, or info blocks) to increase readability and feel high-end.
*   **Sandy Card Background (`#F4EDE450`)**: A light hover overlay for buttons and interactive items inside beige cards.

### 1.3 Borders & Text Colors

*   **Sandy Card Border (`#E7DDD3`)**: Outlines cards on warm beige backgrounds.
*   **Text Slate Gray (`#4A5568`)**: Highly readable dark gray used for description texts on light-blue/gray backgrounds.
*   **Text Warm Brown (`#72665D`)**: Soft brown-gray shade used for reading text on beige backgrounds.
*   **Light Slate Label (`#94A3B8` / `#64748B`)**: Secondary text, micro-descriptions, and italic badges.

---

## 2. Typography & Fonts

We load two premium Google Fonts in the application layout:

1.  **Outfit (Variable: `--font-outfit`)**: A clean geometric sans-serif with soft roundings used exclusively for headings.
2.  **Inter (Variable: `--font-inter`)**: A highly readable utility font used for paragraphs, UI descriptions, tables, and form fields.

### 2.1 Heading Hierarchy (Outfit)
Headings use a compact line height (`leading-[1.06]`) and bold configurations to look solid and intentional:

*   **H1 (Hero Headline)**: `text-[36px]` (mobile) to `text-[54px]` (desktop) \| `font-extrabold` \| `leading-[1.06]`.
*   **H2 (Section Header)**: `text-[34px]` (mobile) to `text-[44px]` (desktop) \| `font-extrabold` \| `leading-[1.1]`.
*   **H3 (Card Title)**: `text-[24px]` to `text-[28px]` \| `font-bold` \| `leading-tight`.

### 2.2 Body & UI Text (Inter)
*   **Body Copy**: `text-[16px]` to `text-[17px]` \| `leading-[1.55]` or `leading-[1.6]` \| `text-[#4A5568]` or `text-[#72665D]`.
*   **Micro Labels**: `text-[13px]` \| `italic` or `font-bold uppercase tracking-[2px]`.

---

## 3. Spacing, Grids & Container Rules

*   **Global Content Width**: All primary layout columns are bound inside `max-w-7xl` (`1280px`) centered via `mx-auto px-6`.
*   **Section Padding**: Standard sections use a generous rhythm of `py-24` (`96px`) on desktop to maintain clean visual boundaries.
*   **Hero Padding**: Main top screen uses a slightly tighter rhythm of `py-12 sm:py-14 lg:py-16`.

---

## 4. Premium Aesthetic Elements

To elevate the visual feel from a basic website to a state-of-the-art service portal, the layout employs four distinct graphic details:

### 4.1 Glassmorphic Dark Card
On deep dark backgrounds (like the footer contact card), use glassmorphic layers that integrate smooth backdrops:
```tailwind
bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl
```

### 4.2 Ambient Glowing Spheres
Use large, absolute-positioned blurry circles behind components to create organic visual depth:
```tailwind
absolute top-0 right-0 w-[500px] h-[500px] bg-[#B8643E]/10 rounded-full blur-[120px] pointer-events-none
```

### 4.3 Technical Grid Overlay
On deep navy sections, overlay a subtle technical dot-grid pattern using radial gradients:
```css
/* Inline background helper */
background-image: radial-gradient(circle, white 1.5px, transparent 1.5px);
background-size: 48px 48px;
opacity: 0.03;
```

### 4.4 Embossed SVG Watermark Stamp
When presenting authentic certifications, inspection badges, or photos, embed the physical-looking embossed stamp. It creates a highly realistic, transparent pressed seal effect:
```tsx
{/* Authentic Embossed Watermark Stamp */}
<svg viewBox="0 0 100 100" className="w-40 h-40 pointer-events-none opacity-95" 
     style={{ filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,1)) drop-shadow(-1px -1px 0px rgba(0,0,0,0.45))' }}>
  <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="1.2" />
  <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="1.2" />
  <path id="stampTextPath" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" />
  <text className="text-[8.5px] font-black uppercase" fill="rgba(14,26,43,0.35)">
    <textPath xlinkHref="#stampTextPath" startOffset="0%" textLength="210">• PRÜFUNG • REPARATUR • SERVICE </textPath>
  </text>
</svg>
```

### 4.5 Tilted Geometry & Counter-rotation
Cards showing real-world photos or badges look more dynamic when tilted slightly (`rotate(3deg)`), with overlapping information badges rotated in the opposite direction (`rotate(-3deg)`):
```tsx
{/* Tilted Photo Container */}
<div className="relative rounded-[28px] overflow-hidden shadow-2xl" style={{ transform: 'rotate(3deg)' }}>
  <img src="/photo.jpg" className="object-cover" />
</div>
{/* Counter-Rotated Overlay Badge */}
<div className="absolute -bottom-6 -left-6 bg-white px-5 py-4 shadow-xl" style={{ transform: 'rotate(-3deg)' }}>
  <p className="text-[#B8643E] font-extrabold text-[24px]">24h</p>
</div>
```
