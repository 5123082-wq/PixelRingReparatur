# Design QA — PixelRing Safari-Style Header

- Date: 2026-07-10
- Scope: desktop header material, navigation hierarchy, contrast, expanded services state, and current-page state
- Reference viewport: supplied Safari / PixelRing screenshot, normalized to a 1280 px-wide header crop
- Implementation viewport: 1280 × 720 px production rendering

## Evidence

- Source screenshot: `/var/folders/sw/wqxr8fzn2z9d0ht64tglhf3m0000gn/T/codex-clipboard-67755aa3-0f9e-4032-8ba3-9baf5900d8df.png`
- Side-by-side material comparison: `/tmp/pixelring-header-impl/22-final-material-comparison.png`
- Final default state: `/tmp/pixelring-header-impl/24-final-top-clean.png`
- Final expanded services state: `/tmp/pixelring-header-impl/26-expanded-top-clean.png`
- Final current-page state: `/tmp/pixelring-header-impl/36-neutral-active-outline-top.png`

## Comparison findings

- The implementation keeps the reference's cool translucent character and perceptible underlying content while using a denser readable tint for website navigation text.
- The top row, navigation row, and expanded services grid read as one continuous material; no detached floating panel or nested backdrop blur is visible.
- Default controls are more distinct than the earlier version without overpowering the glass material.
- The 1 px open/hover/focus outline does not change element geometry because it is rendered as an inset outline.
- Active primary navigation, service cards, language selection, and status controls remain visually clear through a soft warm fill and the same subtle neutral outline as inactive controls, without competing with the primary `Service starten` CTA.
- Expanded service cards remain readable over photographic and dark page content.

## QA iterations

1. Unified the material and removed width/scale morphing and detached navigation surfaces.
2. Increased material density and verified the expanded services grid over high-contrast imagery.
3. Increased control contrast and introduced 1 px interaction outlines.
4. Separated open/disclosure state from current-page state so opening a control keeps the 1 px outline.
5. Standardized every active/current navigation element to a soft fill plus the same subtle neutral gray outline as inactive controls; the brand-colored outline appears only on hover/focus/open interaction.

## Severity review

- P0: none
- P1: none
- P2: none
- P3: real-device Safari GPU smoothness and the 390 px mobile visual pass remain manual follow-up checks; fallbacks and reduced-transparency behavior are implemented.

Final result: passed
