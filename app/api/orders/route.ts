import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { notifyAdmins } from "@/lib/notifications";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: (session.user as any).id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            items, total,
            paidAmount, paymentMethod, paymentType,
            senderPhone, transactionId,
            shippingName, shippingPhone, shippingAddress, shippingCity
        } = await req.json();

        // Generate order number
        const orderCount = await prisma.order.count();
        const orderNumber = `NEX-${String(orderCount + 1001).padStart(4, '0')}`;

        const order = await prisma.order.create({
            data: {
                userId: (session.user as any).id,
                total,
                orderNumber,
                paidAmount: paidAmount ?? total,
                paymentMethod: paymentMethod ?? "CASH_ON_DELIVERY",
                paymentType: paymentType ?? "FULL",
                senderPhone,
                transactionId,
                shippingName,
                shippingPhone,
                shippingAddress,
                shippingCity,
                status: "PENDING",
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: { include: { product: true } },
                user: { select: { name: true, email: true } }
            }
        });

        await notifyAdmins(
            "طلب جديد", "New Order",
            `طلب جديد ${orderNumber} من ${order.user.name || order.user.email} - ${total} EGP`, `New order ${orderNumber} from ${order.user.name || order.user.email} - ${total} EGP`,
            "ORDER"
        );

        return NextResponse.json(order);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
