/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;