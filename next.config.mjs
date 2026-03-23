import { getLegacyDatedUrlRedirects } from './lib/posts.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/posts/**',
        search: '',
      },
      /* Public root files (e.g. /shrug.png, /job-application-workflow.svg) */
      {
        pathname: '/**',
        search: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/posts/:slug/assets/:path*',
        destination: '/api/post-assets/:slug/:path*',
      },
    ];
  },
  async redirects() {
    return getLegacyDatedUrlRedirects();
  },
};

export default nextConfig;
