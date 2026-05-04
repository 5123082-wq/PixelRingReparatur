# Premium Elements & Components

Last updated: 2026-05-04.

## Authentic Embossed Watermark Stamp

This component creates a highly realistic, transparent embossed/debossed seal effect on top of photographs or backgrounds, simulating a physical stamp or watermark pressed into the surface.

**Key Characteristics:**
- No solid background (`fill="none"` or transparent).
- Inner graphics (lines, text, icon) use a highly translucent dark grey/blue color `rgba(14,26,43,0.25)` or `0.35`.
- The realistic embossed 3D effect is created entirely via a dual `drop-shadow` SVG filter applied to the root SVG:
  - Top-left dark shadow: `drop-shadow(-1px -1px 0px rgba(0,0,0,0.45))`
  - Bottom-right white highlight: `drop-shadow(1px 1px 0px rgba(255,255,255,1))`
- The component is wrapped in a `pointer-events-none` container to prevent intercepting clicks on the underlying image.

**Usage Rules for AI Agents:**
When requested by the user to "add a stamp" or "add a seal" to a photograph, **you must use exactly this base component structure**. Modify only the text content inside `<textPath>` and the inner `<g>` icon to fit the context. Do not use CSS backgrounds, do not use `backdrop-blur`, and do not alter the `drop-shadow` mechanism unless specifically requested to weaken or strengthen the contrast.

**Source Code Template:**

```tsx
{/* Authentic Embossed Watermark Stamp */}
<div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 z-10 w-32 h-32 md:w-40 md:h-40 pointer-events-none opacity-95">
   <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,1)) drop-shadow(-1px -1px 0px rgba(0,0,0,0.45))' }}>
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="0.8" />
      
      {/* Inner Ring */}
      <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(14,26,43,0.25)" strokeWidth="1.2" />

      {/* Text */}
      <path id="embossedTextPath" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" />
      <text className="text-[8.5px] font-black uppercase" fill="rgba(14,26,43,0.35)">
        <textPath xlinkHref="#embossedTextPath" startOffset="0%" textLength="210" lengthAdjust="spacing">• PRÜFUNG • REPARATUR • SERVICE </textPath>
      </text>

      {/* Center Icon */}
      <g transform="translate(36, 36) scale(1.15)">
         <path stroke="rgba(14,26,43,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </g>
   </svg>
</div>
```
