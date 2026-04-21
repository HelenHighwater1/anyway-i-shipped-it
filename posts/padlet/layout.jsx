import PostShell from '@/components/post/PostShell';

/**
 * Padlet: sketch panel frame for the post body.
 * Site chrome (header + nav) lives in `app/(site)/layout.jsx` via `SiteBlogChrome`.
 * `title` and `date` come from meta.json (passed by the dynamic post page).
 */
export default function PostLayout({ children, title, date }) {
  return (
    <PostShell
      title={title}
      date={date}
      dateInlineLink={{ href: '#presidio-demo', label: 'skip to the demo' }}
    >
      {children}
    </PostShell>
  );
}
