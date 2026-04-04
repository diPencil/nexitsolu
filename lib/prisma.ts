import "./prisma-env-init";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export function getPrismaClient(): PrismaClient {
    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma;
    }

    const client = new PrismaClient({
        adapter: new PrismaMariaDb(process.env.DATABASE_URL as string),
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
