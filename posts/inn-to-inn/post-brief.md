# Post notes (optional)

This file is **optional**. All post copy lives in **`content.mdx`**. Use this space for reminders, not a second draft of the essay.

## Workflow

1. Duplicate `posts/_template` → rename folder to your slug (must match `meta.json` → `slug`).
2. Fill **`meta.json`** (paths like `thumbnail`, `url`, and **`slug`** must match the folder name).
3. Write the full post in **`content.mdx`** (markdown headings and body; add images/videos pointing at `assets/` as needed).
4. Put media in **`assets/`** (compress MP4s per root **`BLOG_STANDARDS.md`**).
5. Run **`npm run dev`**, open **`/posts/your-slug`**, and iterate on **`layout.jsx`** + motion with Cursor (see **`AGENTS.md`**).

Folders whose name starts with **`_`** are not listed as posts. Use **`"published": false`** in `meta.json` until the post should appear in navigation / sorted meta.

## Pointers

- Sketch look, video rules, images, typography: **`BLOG_STANDARDS.md`**
- How agents should collaborate: **`AGENTS.md`**
- When this is the **newest** shipped post, update **`public/latest-post.json`** (see standards).

## Optional assets table

| File (example) | Note |
| ---------------- | ---- |
| `thumbnail.png`  | Card / sharing |
| `demo.mp4`       | Loop, muted, compressed |

## Publish checklist

- [ ] Folder name matches `meta.json` → `slug`
- [ ] `meta.json` `thumbnail` and `url` paths updated
- [ ] `content.mdx` reflects the post you want to ship
- [ ] `layout.jsx` matches the look you want
- [ ] `"published": true` when it should list
- [ ] `public/latest-post.json` if this is the newest post (`BLOG_STANDARDS.md`)
