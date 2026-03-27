import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ensureSubscriptionServicesSeeded } from "@/lib/subscription-services-seed"
import { subscriptionServiceKeyFromName } from "@/lib/subscription-service-key"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        await ensureSubscriptionServicesSeeded()
        const rows = await prisma.subscriptionService.findMany({
            orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
        })
        return NextResponse.json(rows)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        await ensureSubscriptionServicesSeeded()
        const body = await req.json()
        const nameEn = String(body.nameEn || "").trim()
        const nameAr = String(body.nameAr || "").trim()
        if (!nameEn || !nameAr) {
            return NextResponse.json(
                { error: "nameEn and nameAr are required" },
                { status: 400 }
            )
        }
        let key = String(body.key || "")
            .trim()
            .toUpperCase()
            .replace(/[^A-Z0-9_]/g, "_")
            .replace(/^_+|_+$/g, "")
        if (!key) key = subscriptionServiceKeyFromName(nameEn)
        let candidate = key
        let n = 0
        while (await prisma.subscriptionService.findUnique({ where: { key: candidate } })) {
            n += 1
            candidate = `${key}_${n}`
        }
        const sortOrder =
            typeof body.sortOrder === "number"
                ? body.sortOrder
                : parseInt(String(body.sortOrder || "0"), 10) || 0
        const row = await prisma.subscriptionService.create({
            data: {
                key: candidate,
                nameEn,
                nameAr,
                sortOrder,
                active: body.active !== false,
            },
        })
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
