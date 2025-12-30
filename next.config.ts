import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* Whitelist image domains */
  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com",
      "xvdlbqniwgpidfftcuoa.supabase.co"
    ],
  },
};

export default nextConfig;
