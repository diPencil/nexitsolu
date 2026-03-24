import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(0, parseInt(searchParams.get("page") || "0", 10));
    const limit = Math.min(
        100,
        Math.max(1, parseInt(searchParams.get("limit") || "50", 10))
    );
    const category = searchParams.get("category")?.trim() || "";
    const q = searchParams.get("q")?.trim() || "";

    const where: Prisma.ActivityLogWhereInput = {};
    if (category) where.category = category;
    if (q) {
        where.OR = [
            { summary: { contains: q } },
            { path: { contains: q } },
            { userEmail: { contains: q } },
            { username: { contains: q } },
            { action: { contains: q } },
        ];
    }

    const [items, total] = await Promise.all([
        prisma.activityLog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: page * limit,
            take: limit,
        }),
        prisma.activityLog.count({ where }),
    ]);

    return NextResponse.json({
        items,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    });
}
