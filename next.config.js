/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VERCEL_URL: process.env.VERCEL_URL || 'localhost:3000',
  },
  images: {
    domains: ['localhost', 'dimaadigitalmenu.vercel.app', 'dimaacafe.ir'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Unoptimized is the simplest solution for local image uploads
    unoptimized: true,
  },
  // Keep output configuration
  output: 'standalone',
  // Simplify asset handling
  experimental: {
    // Only keep necessary experimental features
    serverComponentsExternalPackages: ['fs'],
  },
}

module.exports = nextConfig 