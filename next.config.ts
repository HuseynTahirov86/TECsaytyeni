
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/sec',
        destination: '/affiliated-bodies/gymnasium-sec',
      },
      {
        source: '/sec/:path*',
        destination: '/affiliated-bodies/gymnasium-sec/:path*',
      },
    ]
  },
};

export default nextConfig;
