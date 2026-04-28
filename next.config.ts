import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Instagram CDN (Graph API)
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
      // Behold.so CDN
      { protocol: 'https', hostname: '**.behold.so' },
      { protocol: 'https', hostname: 'behold.so' },
    ],
  },
};

export default nextConfig;
