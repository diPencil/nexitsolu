import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ensureSubscriptionServicesSeeded } from "@/lib/subscription-services-seed"

/** Public: active subscription service types for company profile labels. */
export async function GET() {
    try {
        await ensureSubscriptionServicesSeeded()
        const rows = await prisma.subscriptionService.findMany({
            where: { active: true },
            orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
            select: { key: true, nameEn: true, nameAr: true },
        })
        return NextResponse.json(rows)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
