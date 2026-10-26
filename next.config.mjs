/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
   * Let a build run while `next dev` is up.
   *
   * Both write `.next`. A verification build started while the dev server was
   * running produced a half-written directory, and the symptoms were not
   * obviously a collision: first `next start` served 500s with
   * "Cannot find module .next/server/pages/_error.js", then the build itself
   * failed with "Cannot find module for page: /_error".
   *
   *   NEXT_DIST_DIR=.next-verify npx next build
   *
   * gives the build its own directory and leaves the dev server alone.
   */
  distDir: process.env.NEXT_DIST_DIR || '.next',

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  experimental: {
    // This will skip static page generation errors
    workerThreads: false,
    cpus: 1
  },
};

export default nextConfig;
