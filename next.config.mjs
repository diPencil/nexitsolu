import path from 'path';
import { fileURLToPath } from 'url';

// Force absolute path for Hostinger
const dbPath = "/home/u909646470/domains/nexitsolu.com/nodejs/prisma/dev.db";
const dbUrl = `file:${dbPath}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname;
    return config;
  },
}

export default nextConfig
