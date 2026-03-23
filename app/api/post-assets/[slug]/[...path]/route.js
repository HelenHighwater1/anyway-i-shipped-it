import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const POSTS_DIR = path.join(process.cwd(), 'posts');

function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  if (slug.startsWith('_') || slug.startsWith('.')) return false;
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) return false;
  return true;
}

export async function GET(_request, context) {
  const params = await context.params;
  const slug = params.slug;
  const segments = params.path;

  if (!isValidSlug(slug)) {
    return new NextResponse(null, { status: 404 });
  }
  if (!Array.isArray(segments) || segments.length === 0) {
    return new NextResponse(null, { status: 404 });
  }
  if (segments.some((s) => s.includes('..') || s.includes('/') || s.includes('\\'))) {
    return new NextResponse(null, { status: 404 });
  }

  const assetsRoot = path.join(POSTS_DIR, slug, 'assets');
  const filePath = path.join(assetsRoot, ...segments);
  const resolvedRoot = path.resolve(assetsRoot) + path.sep;
  const resolvedFile = path.resolve(filePath);

  if (!resolvedFile.startsWith(resolvedRoot)) {
    return new NextResponse(null, { status: 404 });
  }

  if (!fs.existsSync(resolvedFile) || !fs.statSync(resolvedFile).isFile()) {
    return new NextResponse(null, { status: 404 });
  }

  const buf = fs.readFileSync(resolvedFile);
  const ext = path.extname(resolvedFile).toLowerCase();
  const contentType = MIME[ext] ?? 'application/octet-stream';

  return new NextResponse(buf, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
