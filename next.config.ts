// next.config.mjs
import { NextConfig } from "next";

const nextConfig = /** @type {import('next').NextConfig} */ ({
  images: {
    domains: ['placehold.co', 'img.youtube.com'],
  },
});

export default nextConfig;
