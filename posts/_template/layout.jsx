/**
 * Post-specific shell: sketch layout + motion go here.
 * Optional `title` and `date` (from meta.json) when you add a framed layout like mechanize.
 */
export default function PostLayout({ children, title, date }) {
  return (
    <article>
      {title ? <h1>{title}</h1> : null}
      {date ? (
        <p
          style={{
            marginTop: '-0.25rem',
            marginBottom: '1rem',
            fontSize: '0.8rem',
            color: 'var(--sketch-text-muted)',
          }}
        >
          {date}
        </p>
      ) : null}
      {children}
    </article>
  );
}
