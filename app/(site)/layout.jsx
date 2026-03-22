import SiteBlogChrome from '@/components/blog/SiteBlogChrome';

/** Single place for site header + blog nav on all public routes under (site). */
export default function SiteLayout({ children }) {
  return <SiteBlogChrome>{children}</SiteBlogChrome>;
}
