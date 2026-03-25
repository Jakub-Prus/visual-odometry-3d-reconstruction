import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typedRoutes: false,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
