# Agent instructions - single post folder

Read **root** `BLOG_STANDARDS.md` first (sketch aesthetic, video compression, `meta.json`, `Image` vs `img`, etc.). Before changing **`layout.jsx`** or structure, read this folder’s **`AGENTS.md`** (this file), **`content.mdx`** (all post copy), and optionally **`post-brief.md`** (short workflow notes only - not a second copy source).

## Scope

Work **inside this post folder** (`layout.jsx`, optional colocated `*.module.css`, `assets/`) unless the user asks to wire routing, the home page, or `public/latest-post.json`.

## What the human fills in

- **All post copy** in **`content.mdx`** only (headings, paragraphs, lists - normal MDX/markdown).
- **`meta.json`**: title, date, summary, thumbnail path, url, slug (**must match the folder name**).
- **Assets** under `assets/` (compress MP4s per `BLOG_STANDARDS.md`), referenced from copy or `layout.jsx` as you go.
- **Publish**: set `"published": true` only when this post should appear in `getSortedPostsMeta()`; update `public/latest-post.json` when this is the newest shipped post (per standards).

## Collaborative loop (localhost)

- The human runs **`npm run dev`** and opens **`/posts/{folder-name}`** (e.g. **`/posts/mechanize`**) to preview.
- Treat layout as **iterative**: propose small changes, adjust motion (Framer Motion), typography, and asset placement based on what they see.
- If direction is unclear, **ask** one concrete question (e.g. polaroid frames vs full-width) instead of inventing a full design.
- If multiple sketch-aesthetic options are valid, offer **two** short options (what changes, motion/complexity tradeoff) and let them pick.
- **Flag** deviations from the established sketch language before building them.

## Content vs layout

- **Prefer** composition, motion, and heavy styling in **`layout.jsx`** (and CSS modules).
- **Headings and structure in `content.mdx` are encouraged** for readable copy and accessibility.
- Shared building blocks: `components/post/`, `components/ui/`.

## What the agent may do

- Implement or refine **`layout.jsx`** (and CSS modules): typography, Framer Motion, shared post/sketch components.
- Edit **`content.mdx`** when helping with copy, structure, or accessibility (headings, alt text, clarity).
- Suggest **reduced-motion** and semantic HTML patterns.

## What the agent must not assume

- Do not change global sketch palette or fonts - match `BLOG_STANDARDS.md` / `app/globals.css`.
- Do not add a CMS, database, or new npm dependencies without explicit user approval.
- Do not set `"published": true` unless the user says the post is ready to list.

## New post checklist (routing)

When you add a **new** slug under `posts/`, register its `layout.jsx` in [`lib/postLayouts.js`](../../lib/postLayouts.js) (one import + one line in the map) so the dynamic post page can load it. Template and `_`-prefixed folders are excluded from public post lists by `lib/posts.js`.

## Draft / template behavior (project-wide)

- `posts/_template` is ignored for listings (folder name starts with `_`).
- Any post with **`"published": false`** in `meta.json` is excluded from `getSortedPostsMeta()`.

## Useful paths

- Shared post UI: `components/post/`
- Sketch UI: `components/ui/`
- Post meta helper: `lib/posts.js`
- Post layout registry: `lib/postLayouts.js`
