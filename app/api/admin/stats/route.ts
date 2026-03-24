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
            quotationCount,
            supplierCount,
            purchaseCount,
            recentOrders,
            topCustomers,
            revenueAggregate,
        ] = await Promise.all([
            prisma.user.count({ where: { role: "CUSTOMER" } }),
            prisma.product.count(),
            prisma.order.count(),
            prisma.invoice.count(),
            prisma.subscription.count(),
            prisma.managedITRequest.count(),
            prisma.techSupportRequest.count(),
            prisma.contactMessage.count(),
            prisma.review.count(),
            prisma.user.count({ where: { role: "COMPANY" } }),
            prisma.conversation.count(),
            prisma.quotation.count(),
            prisma.supplier.count(),
            prisma.purchase.count(),
            prisma.order.findMany({
                take: 8,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true, email: true } },
                    items: { include: { product: { select: { name: true } } } },
                },
            }),
            prisma.user.findMany({
                where: { role: "CUSTOMER" },
                take: 5,
                orderBy: { orders: { _count: "desc" } },
                include: { _count: { select: { orders: true } } },
            }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: {
                    status: { in: ["DELIVERED", "PROCESSING", "SHIPPED", "PENDING"] },
                },
            }),
        ]);

        const stats = {
            totalRevenue: revenueAggregate._sum.total ?? 0,
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
            totalQuotations: quotationCount,
            totalSuppliers: supplierCount,
            totalPurchases: purchaseCount,
        };

        return NextResponse.json({ stats, recentOrders, topCustomers });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
