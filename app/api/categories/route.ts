import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/** Public list of store categories (same data as admin Categories UI). */
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: "asc" },
        });
        return NextResponse.json(categories);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
