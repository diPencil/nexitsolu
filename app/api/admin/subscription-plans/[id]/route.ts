import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const { id } = await params
        if (!id) return new NextResponse("Missing id", { status: 400 })

        const body = await req.json()
        const data: Record<string, unknown> = {}

        if (body.nameEn !== undefined)
            data.nameEn = String(body.nameEn).trim()
        if (body.nameAr !== undefined)
            data.nameAr = String(body.nameAr).trim()
        if ("serviceKey" in body) {
            const raw = body.serviceKey
            data.serviceKey =
                raw == null || String(raw).trim() === ""
                    ? null
                    : String(raw).trim()
        }
        if (body.sortOrder !== undefined) {
            const s = parseInt(String(body.sortOrder), 10)
            if (!Number.isNaN(s)) data.sortOrder = s
        }
        if (body.active !== undefined) data.active = !!body.active
        if ("suggestedAmount" in body) {
            const v = body.suggestedAmount
            if (v === "" || v == null) data.suggestedAmount = null
            else {
                const n = parseFloat(String(v))
                data.suggestedAmount = Number.isFinite(n) ? n : null
            }
        }

        if (Object.keys(data).length === 0) {
            return new NextResponse("No updates", { status: 400 })
        }

        const row = await prisma.subscriptionPlan.update({
            where: { id },
            data: data as any,
        })
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const { id } = await params
        if (!id) return new NextResponse("Missing id", { status: 400 })

        const row = await prisma.subscriptionPlan.findUnique({
            where: { id },
        })
        if (!row) {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }

        const inUse = await prisma.subscription.count({
            where:
                row.serviceKey != null && row.serviceKey !== ""
                    ? {
                          AND: [
                              {
                                  OR: [
                                      { planName: row.nameEn },
                                      { planName: row.nameAr },
                                  ],
                              },
                              { serviceKey: row.serviceKey },
                          ],
                      }
                    : {
                          OR: [
                              { planName: row.nameEn },
                              { planName: row.nameAr },
                          ],
                      },
        })
        if (inUse > 0) {
            return NextResponse.json(
                {
                    error: "PLAN_IN_USE",
                    message:
                        "Subscriptions use this plan name. Change them first.",
                },
                { status: 409 }
            )
        }

        await prisma.subscriptionPlan.delete({ where: { id } })
        return new NextResponse(null, { status: 204 })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
