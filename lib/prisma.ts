import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export function getPrismaClient(): PrismaClient {
    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma;
    }

    // Dynamic import for the adapter
    const { createClient } = require("@libsql/client");
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    
    // In Hostinger standalone, the app runs from .next/standalone/
    // but the prisma folder is usually at the root of the project.
    // Use DATABASE_URL from .env if it exists, otherwise fall back to local path.
    let dbUrl = process.env.DATABASE_URL;

    if (!dbUrl || dbUrl.includes("D:/")) {
        // Fallback for local or if .env is missing absolute path
        const dbPath = path.join(process.cwd(), "prisma", "dev.db");
        dbUrl = `file:${dbPath}`;
    }
    
    console.log(`Prisma connecting to:`, dbUrl);
    
    // For LibSQL/SQLite
    const libsql = createClient({ url: dbUrl });
    const adapter = new PrismaLibSql(libsql);
    
    const client = new PrismaClient({ 
        adapter: adapter as any,
        log: ['error', 'warn'] 
    });

    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = client;
    }

    return client;
}

export const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop) {
        const client = getPrismaClient();
        return (client as any)[prop];
    }
});
