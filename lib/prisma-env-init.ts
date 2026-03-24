/**
 * Must run before `import { PrismaClient } from "@prisma/client"`.
 * Loads `.env` / `.env.local` into `process.env` (dev sometimes evaluates API
 * bundles before Next injects them). Then sets DATABASE_URL for LibSQL + Prisma 7.
 */
import { loadEnvConfig } from "@next/env";
import { resolveDatabaseUrl } from "./database-url";

loadEnvConfig(process.cwd());
process.env["DATABASE_URL"] = resolveDatabaseUrl();
