import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
    logBusinessActivity,
    sessionUser,
} from "@/lib/log-business-activity"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const quotations = await prisma.quotation.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(quotations)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const data = await req.json()
        const quotation = await prisma.quotation.create({
            data: {
                quotationNo: data.quotationNo,
                userId: data.userId,
                amount: data.amount,
                notes: data.notes,
                items: data.items,
                subtotal: data.subtotal,
                discount: data.discount,
                tax: data.tax,
                validUntil: data.validUntil ? new Date(data.validUntil) : null,
                status: "PENDING"
            }
        })
        await logBusinessActivity(sessionUser(session), {
            action: "QUOTATION_CREATE",
            summary: `Created quotation ${quotation.quotationNo}`,
            resourceType: "Quotation",
            resourceId: quotation.id,
            req,
        })
        return NextResponse.json(quotation)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id, ...data } = await req.json()
        const quotation = await prisma.quotation.update({
            where: { id },
            data: {
                ...data,
                validUntil: data.validUntil ? new Date(data.validUntil) : undefined
            }
        })
        await logBusinessActivity(sessionUser(session), {
            action: "QUOTATION_UPDATE",
            summary: `Updated quotation ${quotation.quotationNo}`,
            resourceType: "Quotation",
            resourceId: quotation.id,
            req,
        })
        return NextResponse.json(quotation)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return new NextResponse("Missing ID", { status: 400 })

        const existing = await prisma.quotation.findUnique({
            where: { id },
            select: { quotationNo: true },
        })
        await prisma.quotation.delete({ where: { id } })
        await logBusinessActivity(sessionUser(session), {
            action: "QUOTATION_DELETE",
            summary: existing
                ? `Deleted quotation ${existing.quotationNo}`
                : `Deleted quotation ${id}`,
            resourceType: "Quotation",
            resourceId: id,
            req,
        })
        return new NextResponse("Deleted", { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
