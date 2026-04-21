import PostShell from '@/components/post/PostShell';

/**
 * Baseline post layout: delegates to shared `PostShell` (SketchPanel + typography).
 * Duplicate this folder for a new post. For per-post motion or panel tweaks, pass
 * `className` / `contentClassName` to `PostShell` and add a colocated `layout.module.css`.
 *
 * Site chrome (header + nav) lives in `app/(site)/layout.jsx` via `SiteBlogChrome`.
 * `title` and `date` come from meta.json (passed by the dynamic post page).
 */
export default function PostLayout({ children, title, date }) {
  return (
    <PostShell title={title} date={date}>
      {children}
    </PostShell>
  );
}
