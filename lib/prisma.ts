import "./prisma-env-init";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { projectRootForDb, resolveDatabaseUrl } from "./database-url";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export function getPrismaClient(): PrismaClient {
    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma;
    }

    const { PrismaLibSql } = require("@prisma/adapter-libsql");

    const dbUrl = process.env["DATABASE_URL"] ?? resolveDatabaseUrl();
    process.env["DATABASE_URL"] = dbUrl;

    const prismaDir = path.join(projectRootForDb(), "prisma");
    if (!fs.existsSync(prismaDir)) {
        fs.mkdirSync(prismaDir, { recursive: true });
    }

    // Prisma 7: PrismaLibSql is a factory — pass `{ url }`, not a pre-built createClient() result.
    const adapter = new PrismaLibSql({ url: dbUrl });

    const client = new PrismaClient({
        adapter,
        log: ["error", "warn"],
    });

    globalForPrisma.prisma = client;
    return client;
}

export const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop) {
        const client = getPrismaClient();
        return (client as any)[prop];
    },
});
