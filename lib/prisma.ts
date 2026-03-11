import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export function getPrismaClient(): PrismaClient {
    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma;
    }

    // Dynamic import workaround - use require for synchronous loading
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const url = process.env.DATABASE_URL || "file:./prisma/dev.db";
    const adapter = new PrismaLibSql({ url });
    const client = new PrismaClient({ adapter } as any);

    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = client;
    }

    return client;
}

// Export a proxy that lazily initializes
export const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop) {
        const client = getPrismaClient();
        return (client as any)[prop];
    }
});
