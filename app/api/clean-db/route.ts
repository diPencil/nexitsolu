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
        await prisma.invoice.deleteMany({})
        await prisma.order.deleteMany({})
        
        await prisma.reviewMessage.deleteMany({})
        await prisma.review.deleteMany({})
        
        await prisma.message.deleteMany({})
        await prisma.notification.deleteMany({})
        await prisma.favorite.deleteMany({})
        await prisma.wishlist.deleteMany({})
        
        await prisma.product.deleteMany({})
        await prisma.category.deleteMany({})
        
        await prisma.managedITRequest.deleteMany({})
        await prisma.subscription.deleteMany({})
        await prisma.techSupportRequest.deleteMany({})
        await prisma.contactMessage.deleteMany({})
        await prisma.shippingZone.deleteMany({})

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
