import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-b2d57456-beda-4244-be65-be3271a45c8f.space-z.ai",
    ".space-z.ai",
    "127.0.0.1",
    "localhost",
  ],
};

export default nextConfig;
