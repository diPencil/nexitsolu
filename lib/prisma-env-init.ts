/**
 * Must run before `import { PrismaClient } from "@prisma/client"`.
 * Loads `.env` / `.env.local` into `process.env` so DATABASE_URL is available.
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
