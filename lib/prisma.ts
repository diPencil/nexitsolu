import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export function getPrismaClient(): PrismaClient {
    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma;
    }

    // Dynamic import for the adapter
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    
    // Construct absolute path
    // In Hostinger standalone, the app runs from .next/standalone/
    // but the prisma folder is usually at the root of the project.
    // We try to find the root.
    const rootPath = process.cwd();
    const dbPath = path.join(rootPath, "prisma", "dev.db");
    const dbUrl = `file:${dbPath}`;
    
    console.log("Prisma connecting to:", dbUrl);
    
    const adapter = new PrismaLibSql({ url: dbUrl });
    const client = new PrismaClient({ 
        adapter: adapter as any,
        log: ['query', 'error', 'warn'] 
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
