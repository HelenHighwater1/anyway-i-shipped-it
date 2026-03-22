# BLOG_STANDARDS.md
# Anyway, I Shipped It - Project Standards

This document is the source of truth for how this project is built and maintained.
Read this before starting any new session or working on any new post.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Animation**: Framer Motion
- **Styling**: CSS Modules - one per component, scoped and explicit
- **Content**: MDX for post body (`content.mdx`); per-post listing metadata in `meta.json`
- **Media**: MP4 video files (compressed before adding to repo), SVG diagrams
- **Deployment**: Vercel

---

## Folder Structure

```
/public
  /assets               ← shared global assets (fonts, icons, etc.)
  latest-post.json      ← auto-updated on publish, consumed by portfolio site

/posts
  /[post-slug]
    content.mdx         ← all post body copy (markdown / MDX)
    meta.json           ← title, date, summary, thumbnail path, slug, url
    post-brief.md       ← optional short workflow / checklist (not a second copy source)
    layout.jsx          ← unique layout and animation for this post
    /assets
      *.png / *.jpg     ← screenshots and images
      *.mp4             ← compressed video demos
      *.svg             ← diagrams and illustrations

/components
  /ui                   ← shared sketch-aesthetic UI components (cards, borders, callouts)
  /flowchart            ← landing workflow: `ApplicationWorkflowSvg.jsx` + build-synced `applicationWorkflowSvgSource.js` (run `npm run sync-workflow-svg` after editing `public/application-workflow.svg`); Rough.js editor: `flowchartConfig.js` + `JobApplicationWorkflow.jsx`
  /post                 ← shared post-level components (video player, image frame, nav)

/app
  page.jsx              ← landing page
  /dev/flowchart-editor ← dev-only visual editor for the landing flowchart (404 in production)
  /posts/[slug]
    page.jsx            ← dynamic post page, loads post's layout.jsx
```

---

## Post Metadata

Each post folder contains a `meta.json` file with the following structure.
This is the single source of truth for post metadata - do not duplicate these fields elsewhere.

```json
{
  "slug": "post-folder-name",
  "title": "Post Title Here",
  "date": "YYYY-MM-DD",
  "summary": "One line - can be a joke. This appears on the landing page card.",
  "thumbnail": "/posts/[slug]/assets/thumbnail.png",
  "url": "https://anyway-i-shipped-it.com/posts/[slug]"
}
```

---

## Content Workflow - Adding a New Post

1. Create a new folder under `/posts/[slug]` (duplicate `posts/_template` and rename), or start from an existing post folder pattern
2. Fill in `meta.json` - **`slug` must match the folder name**; set `thumbnail` and `url` paths; use `"published": false` until the post should appear in sorted meta
3. Write **all** post copy in `content.mdx` (headings, paragraphs, lists; reference assets under `assets/` as needed)
4. Add compressed assets to `/posts/[slug]/assets/` (see Video Standards below)
5. Register the post’s `layout.jsx` in `lib/postLayouts.js` (one import + one map entry) so `/posts/[slug]` can load it
6. Run `npm run dev`, open `/posts/[slug]`, and iterate on `layout.jsx` + motion with Cursor - see that folder’s `AGENTS.md`
7. Optional: keep short notes or a checklist in `post-brief.md` (not required for copy)
8. Push to GitHub → Vercel deploys automatically
9. `latest-post.json` in `/public` is updated → triggers portfolio site rebuild when this is the newest shipped post

---

## Post Layout Philosophy

Each post has its own `layout.jsx` and is treated as a unique design project.
Posts should feel distinct from one another - the content and assets of each post
should inform its layout and interactions, not a shared template.

Shared components (video player, image frame, post navigation) live in `/components/post`
and should be used consistently across posts. Everything else is fair game to customize.

### Optional content vocabulary (in `content.mdx`)

You do **not** need a separate brief or label pass. These are optional hints for structuring MDX so layout and styling stay predictable:

- **Title** - lives in `meta.json`; repeat in frontmatter of `content.mdx` only if useful for tooling
- **Section headings** - normal markdown `##` / `###` in `content.mdx`
- **Asides / callouts** - blockquotes or short paragraphs you can style from `layout.jsx`
- **Captions** - text under an image, video, or diagram (markdown or MDX)
- **Media** - reference MP4s, PNGs, SVGs under `assets/` with paths consistent with `meta.json` / public URL rules

---

## Video Standards

- Format: MP4 (H.264), with WebM as optional fallback
- Compress with Handbrake before adding to repo - target under 5MB per clip
- Max recording width: 1200px
- Embed as `<video autoPlay loop muted playsInline>` - no controls, no audio
- Never autoplay on mobile without user interaction - add appropriate attribute handling

---

## Portfolio Integration

When a new post is published, `/public/latest-post.json` must be updated.
This file is consumed by the heyimhelen.com portfolio site at build time.
It must always reflect the most recently published post.

```json
{
  "title": "",
  "summary": "",
  "thumbnail": "",
  "url": "",
  "date": ""
}
```

A Vercel deploy hook on the portfolio site triggers a rebuild automatically
when this file is updated. No manual steps required after pushing to GitHub.

---

## Aesthetic & Styling

All values below are pulled directly from the heyimhelen2026 portfolio source (`tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, and the sketch components). The blog uses CSS Modules, so everything is documented as CSS custom properties and module-scoped classes.

---

### CSS Custom Properties

Define these on `:root` in the blog's global stylesheet. These are the exact values from the portfolio - do not alter them.

```css
:root {
  /* Backgrounds */
  --sketch-bg: #f8f7f4;        /* page background */
  --sketch-bg-warm: #f3f1ec;   /* warm card/panel tint */

  /* Strokes & borders */
  --sketch-stroke: #1e1e1e;        /* primary border/stroke color */
  --sketch-stroke-light: #b0aeaa;  /* arrows, corner marks, secondary lines */

  /* Text */
  --sketch-text: #333333;        /* primary text */
  --sketch-text-muted: #777777;  /* captions, secondary labels */

  /* Accent colors */
  --sketch-blue: #4a90d9;    /* links, active state, frontend category */
  --sketch-coral: #e07a5f;   /* email/contact, database highlights */
  --sketch-green: #6ba368;   /* backend category, success states */
  --sketch-purple: #8b5cf6;  /* alternate accent */
  --sketch-amber: #d4a843;   /* alternate accent */
}
```

---

### Fonts

#### Virgil - the hand-drawn sketch font

Excalidraw's Virgil font is responsible for every element that looks hand-drawn. Load it via `@font-face` in the global stylesheet:

```css
@font-face {
  font-family: 'Virgil';
  src: url('https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0.17.0/dist/excalidraw-assets/Virgil.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

Also add a `<link rel="preload">` in the `<head>` for faster loading:

```html
<link
  href="https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0.17.0/dist/excalidraw-assets/Virgil.woff2"
  rel="preload"
  as="font"
  type="font/woff2"
  crossOrigin=""
/>
```

Use the full fallback stack everywhere Virgil is applied:

```css
font-family: 'Virgil', 'Segoe Print', 'Comic Sans MS', cursive;
```

**Where Virgil is used in the portfolio (use the same rules in the blog):**
- All headings and post titles
- Navigation labels
- Button text
- Callout and annotation text
- Tag/pill labels
- Captions
- Footer text
- Any SVG text labels rendered via Rough.js

#### Inter - the body/UI font

Used for any non-sketch prose or UI text. Load via Next.js `next/font/google`:

```js
import { Inter } from 'next/font/google';

const sansFont = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
});
```

Reference as:

```css
font-family: var(--font-sans), system-ui, sans-serif;
```

In the blog, use Virgil for all post content (titles, headings, callouts, captions). Inter is appropriate for UI chrome only if needed.

---

### Background: Dotted Grid

Applied to the `<body>` element. Mimics Excalidraw's canvas background.

```css
.dotGrid {
  background-image: radial-gradient(
    circle,
    var(--sketch-stroke-light) 0.8px,
    transparent 0.8px
  );
  background-size: 24px 24px;
}
```

- Dot color: `#b0aeaa` (via `--sketch-stroke-light`)
- Dot radius: `0.8px`
- Grid spacing: `24px × 24px`

---

### Background: Cross-Hatch (optional card texture)

An alternative to the dot grid for use inside cards or panels where a subtle texture is wanted:

```css
.crossHatch {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 8px,
    rgba(0, 0, 0, 0.02) 8px,
    rgba(0, 0, 0, 0.02) 9px
  );
}
```

---

### Sketch Border Effect - CSS-only (no library)

This technique is used for buttons, tags, and callouts. The double-layer border (a solid `border` plus a faint `outline` slightly outside it) creates the illusion of a slightly imperfect, hand-drawn edge without Rough.js.

```css
/* The combined effect: a visible border + ghost outline offset = looks slightly wobbly */
border: 2px solid var(--sketch-stroke);
border-radius: 4px;
outline: 1px solid rgba(30, 30, 30, 0.05);
outline-offset: 1.5px;
```

**What this produces:** The inner border is the main stroke. The outer ghost outline is barely visible but creates the impression that the line is not perfectly clean - the eye reads it as hand-drawn.

For lighter contexts (tags, secondary elements), reduce the outline opacity:

```css
border: 1.5px solid var(--sketch-stroke-light);
border-radius: 4px;
outline: 1px solid rgba(30, 30, 30, 0.03);
outline-offset: 1px;
```

---

### Sketch Panel - Full Panel Card with Rough.js Border

The main page panel is drawn using [Rough.js](https://roughjs.com/), which renders an SVG rectangle with a deliberately imperfect, hand-drawn stroke. This is a React component pattern - the SVG is absolutely positioned behind the content.

**Rough.js rectangle options used for the main `SketchPanel`:**

```js
rc.rectangle(4, 4, width - 8, height - 8, {
  stroke: '#1e1e1e',
  strokeWidth: 1.8,
  roughness: 1.2,
  bowing: 1.5,
  fill: 'rgba(255, 254, 249, 0.5)',
  fillStyle: 'solid',
});
```

Corner crosshair decorations (the "+" marks at each corner) are drawn with:

```js
// Horizontal arm of each corner mark
rc.line(cx - 8, cy, cx + 8, cy, { stroke: '#b0aeaa', strokeWidth: 1, roughness: 0.8 });
// Vertical arm
rc.line(cx, cy - 8, cx, cy + 8, { stroke: '#b0aeaa', strokeWidth: 1, roughness: 0.8 });
```

Corner mark offset from panel edge: `12px`. Corner arm length: `8px` each side.

**Container structure (CSS Module equivalent):**

```css
.sketchPanel {
  position: relative;
  min-height: 60vh;
}

.sketchPanelSvg {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 0;
}

.sketchPanelContent {
  position: relative;
  z-index: 10;
  padding: 1.5rem;          /* p-6 */
  animation: fadeIn 0.4s ease-out forwards;
}

@media (min-width: 768px) {
  .sketchPanelContent {
    padding: 2.5rem;        /* md:p-10 */
  }
}
```

---

### Sketch Box - Smaller Card with Rough.js Border

A lighter-weight version of `SketchPanel` used for individual content cards.

**Rough.js rectangle options:**

```js
rc.rectangle(2, 2, width - 4, height - 4, {
  stroke: '#1e1e1e',      /* or a custom strokeColor prop */
  strokeWidth: 1.5,
  roughness: 1.0,
  bowing: 1.2,
  fill: 'rgba(255, 254, 249, 0.3)',
  fillStyle: 'solid',
});
```

Default content padding: `p-5 md:p-6` (1.25rem / 1.5rem).

---

### Annotation Callout

Used for hover tooltips and highlighted asides. Produces a sticky-note-style box with an arrow pointer and a slight rotation.

```css
.annotationCallout {
  position: relative;
  font-family: 'Virgil', 'Segoe Print', 'Comic Sans MS', cursive;
  border: 2px solid var(--sketch-stroke);
  border-radius: 4px;
  background-color: #fffef9;
  padding: 0.75rem 1rem;
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(30, 30, 30, 0.06);
  outline-offset: 1.5px;
  transform: rotate(-0.3deg);  /* the subtle tilt that makes it feel hand-placed */
}

/* Arrow pointer (top-left by default) */
.annotationCallout::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 20px;
  width: 14px;
  height: 14px;
  background-color: #fffef9;
  border-top: 2px solid var(--sketch-stroke);
  border-left: 2px solid var(--sketch-stroke);
  transform: rotate(45deg);
}

/* Centered arrow variant */
.annotationCallout.calloutCenter::before {
  left: 50%;
  margin-left: -7px;
}
```

**What the combined effect produces:** The slight rotation + doubled border (border + faint outline) + offset shadow + diamond arrow pointer together create the look of a hand-written sticky note pinned to the page.

---

### Button - Sketch Style

```css
.btnSketch {
  font-family: 'Virgil', 'Segoe Print', 'Comic Sans MS', cursive;
  border: 2px solid var(--sketch-stroke);
  border-radius: 4px;
  padding: 0.5rem 1.25rem;
  background: transparent;
  color: var(--sketch-text);
  cursor: pointer;
  transition: background-color 0.15s, transform 0.1s;
  position: relative;
  outline: 1px solid rgba(30, 30, 30, 0.05);
  outline-offset: 1.5px;
}

.btnSketch:hover {
  background-color: rgba(74, 144, 217, 0.08);  /* --sketch-blue at 8% opacity */
  transform: translate(-1px, -1px) rotate(-0.5deg);  /* nudges up-left and tilts on hover */
}

.btnSketch:active {
  transform: translate(0, 0) rotate(0deg);  /* snaps back on press */
}
```

**What the combined hover effect produces:** The button shifts 1px up and left, rotates -0.5deg, and gets a faint blue wash. Together this reads as a physical button being picked up off the page.

---

### Link - Sketch Style

```css
.sketchLink {
  font-family: 'Virgil', 'Segoe Print', 'Comic Sans MS', cursive;
  color: var(--sketch-blue);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s, opacity 0.15s;
}

.sketchLink:hover {
  border-bottom-color: var(--sketch-blue);  /* underline appears on hover */
  opacity: 0.8;
}
```

---

### Tag / Pill

Used for technology labels and category tags.

```css
.sketchTag {
  display: inline-block;
  font-family: 'Virgil', 'Segoe Print', 'Comic Sans MS', cursive;
  font-size: 0.75rem;
  padding: 0.15rem 0.6rem;
  border: 1.5px solid var(--sketch-stroke-light);
  border-radius: 4px;
  color: var(--sketch-text-muted);
  background: transparent;
  outline: 1px solid rgba(30, 30, 30, 0.03);
  outline-offset: 1px;
}
```

---

### Hover Lift

Used consistently across interactive sketch elements (nav boxes, tech diagram boxes, cards):

```css
transition: transform 0.12s ease;

/* on hover */
transform: translateY(-2px);

/* on leave */
transform: none;
```

---

### Fade-In Animation

Applied to panels and elements that animate in on mount:

```css
@keyframes fadeIn {
  0%   { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animateFadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}
```

---

### Layout Constraints

From the portfolio's root layout - apply the same to the blog's page wrapper:

```css
.pageWrapper {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.5rem 1rem;     /* py-6 px-4 */
}

@media (min-width: 768px) {
  .pageWrapper {
    padding: 2rem 2rem;     /* md:py-8 md:px-8 */
  }
}
```

---

### Rough.js Usage Notes

The portfolio uses [roughjs](https://roughjs.com/) (`npm install roughjs`) for drawing SVG borders on `SketchPanel` and `SketchBox`. It is imported dynamically to avoid SSR issues:

```js
const rough = (await import('roughjs')).default;
const rc = rough.svg(svgElement);
```

Key parameters and what they control:
- `roughness` - how jagged the line is. `1.0`–`1.2` is the standard range used here. Higher = more chaotic.
- `bowing` - how much the line bows/curves between endpoints. `1.2`–`1.5` is used here.
- `strokeWidth` - `1.5` for boxes, `1.8` for the main panel, `2.0` for colored accent boxes.
- `fillStyle: 'solid'` - required to get a flat fill instead of hatch lines.

For arrows and connector lines, use `roughness: 0.6`–`0.8` (straighter, but still hand-drawn).

---

## Things to Never Do

- Do not introduce a CMS, external content store, or third-party component library without first stopping and asking the user - explain the tradeoff clearly and wait for a decision before proceeding
- Do not add npm dependencies without flagging and justifying them
- Do not use `<img>` tags - use Next.js `<Image>` for all static images
- Do not hardcode colors or fonts outside of CSS variables
- Do not duplicate post metadata - `meta.json` is the single source of truth
- Prefer keeping heavy layout and motion in `layout.jsx` (and CSS modules); use `content.mdx` for copy and readable structure (headings, lists, media references)
