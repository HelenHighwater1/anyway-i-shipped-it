'use client';

import SiteHeader from '@/components/blog/SiteHeader';
import BlogNav from '@/components/ui/BlogNav';
import styles from './SiteBlogChrome.module.css';

/**
 * Shared shell: title row, shrug image, tagline, sketch nav, then page content.
 * Site title renders as `<p>` so each route can own a single page `<h1>` (home Intro, archive, article).
 */
export default function SiteBlogChrome({ children }) {
  return (
    <div className={styles.shell}>
      <SiteHeader siteTitleTag="p" />
      <BlogNav />
      {children}
    </div>
  );
}
