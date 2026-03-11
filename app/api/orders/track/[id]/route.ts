import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: orderId } = await params;

        // Try exact match first
        let order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // If not found and it looks like a short code (6 chars), try searching by suffix
        if (!order && orderId.length === 6) {
            try {
                order = await prisma.order.findFirst({
                    where: {
                        id: {
                            endsWith: orderId.toLowerCase()
                        }
                    },
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });
            } catch (e) {
                console.error("Suffix search failed", e);
            }
        }

        // Also try searching by orderNumber (case-insensitive)
        if (!order) {
            try {
                order = await prisma.order.findFirst({
                    where: { 
                        orderNumber: {
                            equals: orderId,
                        }
                    },
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });
                
                // If still not found, try case-insensitive manual search if it's NEX-
                if (!order && orderId.toUpperCase().startsWith('NEX-')) {
                    order = await prisma.order.findFirst({
                        where: {
                            orderNumber: {
                                equals: orderId.toUpperCase()
                            }
                        },
                        include: {
                            items: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    });
                }
            } catch (e) {
                console.error("OrderNumber search failed", e);
            }
        }

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
