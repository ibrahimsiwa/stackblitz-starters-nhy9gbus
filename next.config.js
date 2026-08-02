import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bolt.new',
        pathname: '/static/**',
      },
    ],
  },
};

export default nextConfig;