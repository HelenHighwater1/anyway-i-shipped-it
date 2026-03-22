'use client';

import Image from 'next/image';
import { SITE_TITLE, SITE_TAGLINE } from '@/lib/site';
import styles from './SiteHeader.module.css';

/**
 * @param {{ className?: string, siteTitleTag?: 'h1' | 'p' }} props
 * `SiteBlogChrome` passes `p` so route content can own the document `<h1>`.
 */
export default function SiteHeader({ className = '', siteTitleTag = 'p' }) {
  const SiteTitleTag = siteTitleTag === 'p' ? 'p' : 'h1';
  return (
    <header
      className={[styles.header, 'animateFadeIn', className].filter(Boolean).join(' ')}
    >
      <div className={styles.titleRow}>
        <SiteTitleTag className={styles.siteTitle}>{SITE_TITLE}</SiteTitleTag>
        <Image
          src="/shrug.png"
          alt=""
          width={936}
          height={254}
          className={styles.titleShrug}
          priority
        />
      </div>
      <p className={styles.tagline}>{SITE_TAGLINE}</p>
    </header>
  );
}
