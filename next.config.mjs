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
};

export default nextConfig;
