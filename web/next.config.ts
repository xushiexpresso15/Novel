import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages usually requires a basePath if not using a custom domain.
  // We leave it commented out for the user to enable if needed.
  basePath: '/Novel',
  images: {
    unoptimized: true, // Required for static export
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'yjs': require.resolve('yjs'),
      'y-prosemirror': require.resolve('y-prosemirror'),
      'y-protocols': require.resolve('y-protocols'),
      // Dedupe ProseMirror packages
      'prosemirror-model': require.resolve('prosemirror-model'),
      'prosemirror-state': require.resolve('prosemirror-state'),
      'prosemirror-view': require.resolve('prosemirror-view'),
      'prosemirror-transform': require.resolve('prosemirror-transform'),
      '@tiptap/core': require.resolve('@tiptap/core'),
    }
    return config
  },
  experimental: {
    // Removed "turbo" key to prevent invalid config warning
  }
};

export default nextConfig;
