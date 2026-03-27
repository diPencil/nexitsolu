import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const rows = await prisma.subscriptionPlan.findMany({
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
        const body = await req.json()
        const nameEn = String(body.nameEn || "").trim()
        const nameAr = String(body.nameAr || "").trim()
        if (!nameEn || !nameAr) {
            return NextResponse.json(
                { error: "nameEn and nameAr are required" },
                { status: 400 }
            )
        }
        const rawSk = body.serviceKey
        const serviceKey =
            rawSk == null || String(rawSk).trim() === ""
                ? null
                : String(rawSk).trim()

        let suggested: number | null = null
        if (
            body.suggestedAmount !== undefined &&
            body.suggestedAmount !== "" &&
            body.suggestedAmount != null
        ) {
            const n = parseFloat(String(body.suggestedAmount))
            if (Number.isFinite(n)) suggested = n
        }

        const sortOrder =
            typeof body.sortOrder === "number"
                ? body.sortOrder
                : parseInt(String(body.sortOrder || "0"), 10) || 0

        const row = await prisma.subscriptionPlan.create({
            data: {
                nameEn,
                nameAr,
                serviceKey,
                suggestedAmount: suggested,
                sortOrder,
                active: body.active !== false,
            },
        })
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
