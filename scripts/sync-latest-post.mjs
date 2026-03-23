/**
 * Finds the latest published post from each post folder's meta.json (same rules as lib/posts.js),
 * writes public/latest-post.json for the blog (relative thumbnail paths),
 * and writes portfolio JSON (absolute thumbnail URL) to PORTFOLIO_JSON_OUT when set.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const postsDir = path.join(root, "posts");

const BLOG_ORIGIN = (process.env.BLOG_SITE_ORIGIN || "https://anyway-i-shipped-it.com").replace(
  /\/$/,
  ""
);

function getSortedPostsMeta() {
  if (!fs.existsSync(postsDir)) return [];

  const dirs = fs
    .readdirSync(postsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !name.startsWith("_") && !name.startsWith("."));

  const metas = [];
  for (const slug of dirs) {
    const metaPath = path.join(postsDir, slug, "meta.json");
    if (!fs.existsSync(metaPath)) continue;
    try {
      const raw = fs.readFileSync(metaPath, "utf8");
      const meta = JSON.parse(raw);
      if (meta?.published === false) continue;
      if (meta?.slug) metas.push(meta);
    } catch {
      /* skip invalid */
    }
  }

  metas.sort((a, b) => {
    const byDate = String(b.date).localeCompare(String(a.date));
    if (byDate !== 0) return byDate;
    return String(a.slug).localeCompare(String(b.slug));
  });

  return metas;
}

function absUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const p = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${BLOG_ORIGIN}${p}`;
}

function postPageUrl(meta) {
  if (meta.url && /^https?:\/\//i.test(String(meta.url))) return String(meta.url);
  return `${BLOG_ORIGIN}/posts/${meta.slug}`;
}

const sorted = getSortedPostsMeta();
if (!sorted.length) {
  console.error("sync-latest-post: no published posts found under posts/");
  process.exit(1);
}

const latest = sorted[0];

const blogPayload = {
  title: latest.title,
  summary: latest.summary ?? "",
  thumbnail: latest.thumbnail ?? "",
  url: postPageUrl(latest),
  date: latest.date,
};

const portfolioPayload = {
  title: latest.title,
  summary: latest.summary ?? "",
  thumbnail: absUrl(latest.thumbnail ?? ""),
  url: postPageUrl(latest),
  date: latest.date,
};

const blogPath = path.join(root, "public", "latest-post.json");
fs.writeFileSync(blogPath, `${JSON.stringify(blogPayload, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(root, blogPath)}`);

const portfolioOut = process.env.PORTFOLIO_JSON_OUT;
if (portfolioOut) {
  fs.mkdirSync(path.dirname(portfolioOut), { recursive: true });
  fs.writeFileSync(portfolioOut, `${JSON.stringify(portfolioPayload, null, 2)}\n`, "utf8");
  console.log(`Wrote portfolio payload to ${portfolioOut}`);
}
