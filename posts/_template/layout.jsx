/**
 * Post-specific shell: sketch layout + motion go here.
 * Optional `title` (from meta.json) when you add a framed layout like mechanize.
 */
export default function PostLayout({ children, title }) {
  return (
    <article>
      {title ? <h1>{title}</h1> : null}
      {children}
    </article>
  );
}
