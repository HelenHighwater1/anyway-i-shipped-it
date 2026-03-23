import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import MdxCenterFigure from '@/components/post/MdxCenterFigure';
import MdxClickableImage from '@/components/post/MdxClickableImage';
import MdxMediaAside from '@/components/post/MdxMediaAside';
import MdxPostVideo from '@/components/post/MdxPostVideo';
import PostNav from '@/components/post/PostNav';
import { SITE_TITLE } from '@/lib/site';
import { getPostLayout } from '@/lib/postLayouts';
import styles from './page.module.css';

const POSTS_DIR = path.join(process.cwd(), 'posts');

function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  if (slug.startsWith('_') || slug.startsWith('.')) return false;
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) return false;
  return true;
}

function getBuildableSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && isValidSlug(d.name))
    .filter((d) => fs.existsSync(path.join(POSTS_DIR, d.name, 'content.mdx')))
    .filter((d) => fs.existsSync(path.join(POSTS_DIR, d.name, 'meta.json')))
    .map((d) => ({ slug: d.name }));
}

export function generateStaticParams() {
  return getBuildableSlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!isValidSlug(slug)) return { title: SITE_TITLE };

  const metaPath = path.join(POSTS_DIR, slug, 'meta.json');
  if (!fs.existsSync(metaPath)) return { title: SITE_TITLE };

  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const title = meta?.title ? String(meta.title) : slug;
    return { title: `${title} - ${SITE_TITLE}` };
  } catch {
    return { title: SITE_TITLE };
  }
}

function MdxImage({ src, alt, width, height, ...rest }) {
  if (!src || typeof src !== 'string') return null;
  const w = width != null ? Number(width) : 800;
  const h = height != null ? Number(height) : 600;
  const safeW = Number.isFinite(w) && w > 0 ? w : 800;
  const safeH = Number.isFinite(h) && h > 0 ? h : 600;
  return (
    <Image
      src={src}
      alt={alt ?? ''}
      width={safeW}
      height={safeH}
      className={styles.mdxImg}
      {...rest}
    />
  );
}

export default async function PostPage({ params }) {
  const { slug } = await params;

  if (!isValidSlug(slug)) notFound();

  const postDir = path.join(POSTS_DIR, slug);
  const contentPath = path.join(postDir, 'content.mdx');
  const metaPath = path.join(postDir, 'meta.json');

  if (!fs.existsSync(contentPath) || !fs.existsSync(metaPath)) notFound();

  const PostLayout = getPostLayout(slug);
  if (!PostLayout) notFound();

  let postTitle = slug;
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (meta?.title) postTitle = String(meta.title);
  } catch {
    /* keep slug */
  }

  const raw = fs.readFileSync(contentPath, 'utf8');

  let mdxContent;
  try {
    const compiled = await compileMDX({
      source: raw,
      options: { parseFrontmatter: true },
      components: {
        img: MdxImage,
        MdxCenterFigure,
        MdxClickableImage,
        MdxMediaAside,
        MdxPostVideo,
      },
    });
    mdxContent = compiled.content;
  } catch {
    notFound();
  }

  return (
    <div className={styles.page}>
      <PostLayout title={postTitle}>
        <div className={styles.mdxBody}>{mdxContent}</div>
      </PostLayout>
      <PostNav slug={slug} className={styles.nav} />
    </div>
  );
}
