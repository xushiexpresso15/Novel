import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: 'export',
  // Subpath hosting for GitHub Pages
  basePath: '/Novel',
  images: {
    unoptimized: true,
  },
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
