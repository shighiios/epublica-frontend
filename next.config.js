/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ THIS disables ESLint from blocking build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ THIS disables TS from blocking production builds
  },
};

module.exports = nextConfig;
