import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable for performance testing
  // StrictMode causes useEffect to run twice in development
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
