import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [
            userCount, 
            productCount, 
            orderCount, 
            invoiceCount,
            subscriptionCount,
            managedITCount,
            techSupportCount,
            contactMessageCount,
            reviewCount,
            companyCount,
            conversationCount,
            recentOrders, 
            topCustomers
        ] = await Promise.all([
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.product.count(),
            prisma.order.count(),
            prisma.invoice.count(),
            prisma.subscription.count(),
            prisma.managedITRequest.count(),
            prisma.techSupportRequest.count(),
            prisma.contactMessage.count(),
            prisma.review.count(),
            prisma.user.count({ where: { role: 'COMPANY' } }),
            prisma.conversation.count(),
            prisma.order.findMany({
                take: 8,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, email: true } },
                    items: { include: { product: { select: { name: true } } } }
                }
            }),
            prisma.user.findMany({
                where: { role: 'CUSTOMER' },
                take: 5,
                orderBy: { orders: { _count: 'desc' } },
                include: { _count: { select: { orders: true } } }
            }),
        ]);

        const totalRevenue = await prisma.order.aggregate({
            _sum: { total: true }
        });

        return NextResponse.json({
            stats: {
                totalRevenue: totalRevenue._sum.total || 0,
                totalOrders: orderCount,
                totalCustomers: userCount,
                totalProducts: productCount,
                totalInvoices: invoiceCount,
                totalSubscriptions: subscriptionCount,
                totalManagedIT: managedITCount,
                totalTechSupport: techSupportCount,
                totalContactMessages: contactMessageCount,
                totalReviews: reviewCount,
                totalCompanies: companyCount,
                totalConversations: conversationCount,
            },
            recentOrders,
            topCustomers,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
