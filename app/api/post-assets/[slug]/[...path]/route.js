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

/**
 * Parse Range: bytes=start-end (RFC 7233). Returns { start, end } or null.
 */
function parseRangeHeader(rangeHeader, size) {
  if (!rangeHeader || !rangeHeader.startsWith('bytes=')) return null;
  const range = rangeHeader.slice(6).trim();
  const dash = range.indexOf('-');
  if (dash === -1) return null;
  const left = range.slice(0, dash);
  const right = range.slice(dash + 1);

  let start;
  let end;

  if (left === '') {
    const suffixLen = parseInt(right, 10);
    if (Number.isNaN(suffixLen) || suffixLen <= 0) return null;
    start = Math.max(0, size - suffixLen);
    end = size - 1;
  } else {
    start = parseInt(left, 10);
    if (Number.isNaN(start) || start < 0) return null;
    if (start >= size) return null;
    if (right === '') {
      end = size - 1;
    } else {
      end = parseInt(right, 10);
      if (Number.isNaN(end)) return null;
    }
    end = Math.min(end, size - 1);
  }

  if (start > end) return null;
  return { start, end };
}

function readFileSlice(filePath, start, end) {
  const chunkSize = end - start + 1;
  const buf = Buffer.alloc(chunkSize);
  const fd = fs.openSync(filePath, 'r');
  try {
    fs.readSync(fd, buf, 0, chunkSize, start);
  } finally {
    fs.closeSync(fd);
  }
  return buf;
}

export async function GET(request, context) {
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

  const fileSize = fs.statSync(resolvedFile).size;
  const ext = path.extname(resolvedFile).toLowerCase();
  const contentType = MIME[ext] ?? 'application/octet-stream';

  const rangeHeader = request.headers.get('range');
  if (rangeHeader) {
    const parsed = parseRangeHeader(rangeHeader, fileSize);
    if (!parsed) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          'Content-Range': `bytes */${fileSize}`,
        },
      });
    }
    const { start, end } = parsed;
    const chunkSize = end - start + 1;
    const buf = readFileSlice(resolvedFile, start, end);

    return new NextResponse(buf, {
      status: 206,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(chunkSize),
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  const buf = fs.readFileSync(resolvedFile);

  return new NextResponse(buf, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(fileSize),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
