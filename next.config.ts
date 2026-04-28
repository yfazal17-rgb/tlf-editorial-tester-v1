import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Instagram CDN — used directly by Graph API and by Behold as raw mediaUrl
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
      // Behold.so resized CDN (sizes.small/medium/large.mediaUrl)
      { protocol: 'https', hostname: '**.behold.pictures' },
      { protocol: 'https', hostname: 'behold.pictures' },
    ],
  },
};

export default nextConfig;
