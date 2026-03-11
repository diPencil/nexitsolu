import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')

    // حماية بسيطة - لازم تبعت الكلمة السرية
    if (secret !== 'CLEAN_NOW_2025') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const logs: string[] = []

    try {
        // احفظ الادمن الاول
        const adminUsers = await prisma.user.findMany({ where: { role: 'ADMIN' } })
        logs.push(`Found ${adminUsers.length} admin(s) to preserve`)

        // امسح كل الداتا بالترتيب الصح (Foreign Keys)
        await prisma.orderItem.deleteMany({})
        logs.push("Cleared OrderItems")

        await prisma.order.deleteMany({})
        logs.push("Cleared Orders")

        await prisma.review.deleteMany({})
        logs.push("Cleared Reviews")

        await prisma.message.deleteMany({})
        logs.push("Cleared Messages")

        await prisma.notification.deleteMany({})
        logs.push("Cleared Notifications")

        await prisma.product.deleteMany({})
        logs.push("Cleared Products")

        await prisma.category.deleteMany({})
        logs.push("Cleared Categories")

        // امسح كل اليوزرز اللي مش أدمن
        await prisma.user.deleteMany({
            where: { role: { not: 'ADMIN' } }
        })
        logs.push("Cleared non-admin Users")

        // اعرض الادمن اللي محافظ عليه
        const remaining = await prisma.user.findMany({ where: { role: 'ADMIN' } })
        logs.push(`✅ DONE! Admin accounts preserved: ${remaining.map(u => u.email).join(', ')}`)

        return NextResponse.json({ success: true, logs })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, logs }, { status: 500 })
    }
}
