import { resolve } from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.resolve.alias.yjs = resolve("./node_modules/yjs/dist/yjs.mjs");
    return config;
  },
};

export default nextConfig;
