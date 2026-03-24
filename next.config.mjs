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
  // Standalone: schema + Prisma CLI + engines (runtime `db push` on Hostinger)
  outputFileTracingIncludes: {
    '/**': [
      './prisma/**/*',
      './node_modules/prisma/**/*',
      './node_modules/@prisma/engines/**/*',
    ],
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
