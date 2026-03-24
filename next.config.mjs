import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  output: 'standalone',
  // Avoid bundling Prisma/LibSQL into webpack/Turbopack chunks (fixes URL/env issues)
  serverExternalPackages: [
    '@prisma/client',
    'prisma',
    '@prisma/adapter-libsql',
    '@libsql/client',
  ],
  // Ensure prisma folder is copied into `.next/standalone` (Hostinger / SQLite)
  outputFileTracingIncludes: {
    '/**': ['./prisma/**/*'],
  },
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
