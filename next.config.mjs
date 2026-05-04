import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  webpack: (config, { dev, isServer, webpack: wp }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/OrbStack/**', '**/node_modules/**'],
      };
    }
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
      config.plugins.push(
        new wp.NormalModuleReplacementPlugin(
          /^pdfjs-dist/,
          path.resolve(__dirname, 'src/lib/mocks/pdfjs-dist.ts')
        )
      );
      config.module.rules.push({
        test: /node_modules\/@mariozechner\/pi-web-ui/,
        parser: { javascript: { url: false } },
      });
    }
    return config;
  },
};

export default nextConfig;
