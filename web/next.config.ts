import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // output: 'export', // Disabled for dynamic routing support
  // basePath: '/Novel',
  // images: {
  //   unoptimized: true,
  // },
  // Keeping webpack config for Yjs deduplication match
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'yjs': require.resolve('yjs'),
      'y-prosemirror': require.resolve('y-prosemirror'),
      'y-protocols': path.dirname(require.resolve('y-protocols/package.json')),
      // Dedupe ProseMirror packages
      'prosemirror-model': require.resolve('prosemirror-model'),
      'prosemirror-state': require.resolve('prosemirror-state'),
      'prosemirror-view': require.resolve('prosemirror-view'),
      'prosemirror-transform': require.resolve('prosemirror-transform'),
    }
    return config
  },
  experimental: {
    // Removed "turbo" key to prevent invalid config warning
  }
};

export default nextConfig;
