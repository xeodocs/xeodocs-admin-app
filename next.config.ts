import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://dev-api.xeodocs.localhost:12020/v1/:path*",
      },
      // Handle the auth path specifically if it's different or just part of v1
      // The CLI used /auth/login which maps to v1/auth/login in our usage
    ];
  },
};

export default nextConfig;
