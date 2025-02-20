/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VERCEL_URL: process.env.VERCEL_URL || 'localhost:3000',
  },
  images: {
    domains: ['localhost', 'dimaadigitalmenu.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable static exports for better performance
  output: 'standalone',
}

module.exports = nextConfig 