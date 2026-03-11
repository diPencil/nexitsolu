import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function requireAdmin() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "ADMIN") return null
    return session
}

export async function GET() {
    const zones = await prisma.shippingZone.findMany({ orderBy: { nameEn: "asc" } })
    return NextResponse.json(zones)
}

export async function POST(req: Request) {
    if (!await requireAdmin()) return new NextResponse("Unauthorized", { status: 401 })
    const { name, nameAr, nameEn, price, isActive } = await req.json()
    if (!name || !nameAr || !nameEn || price === undefined)
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    const zone = await prisma.shippingZone.create({ data: { name, nameAr, nameEn, price, isActive: isActive ?? true } })
    return NextResponse.json(zone)
}

export async function PUT(req: Request) {
    if (!await requireAdmin()) return new NextResponse("Unauthorized", { status: 401 })
    const { id, name, nameAr, nameEn, price, isActive } = await req.json()
    const zone = await prisma.shippingZone.update({ where: { id }, data: { name, nameAr, nameEn, price, isActive } })
    return NextResponse.json(zone)
}

export async function DELETE(req: Request) {
    if (!await requireAdmin()) return new NextResponse("Unauthorized", { status: 401 })
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")!
    await prisma.shippingZone.delete({ where: { id } })
    return NextResponse.json({ ok: true })
}
