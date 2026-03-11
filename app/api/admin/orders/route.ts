import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: {
                    include: {
                        product: { select: { name: true, nameAr: true, image: true } }
                    }
                }
            }
        });
        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id, status } = await req.json();

        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                user: { select: { name: true, email: true } }
            }
        });

        // Optionally send a notification to the user here
        if (order.userId) {
            await prisma.notification.create({
                data: {
                    userId: order.userId,
                    title: "Order Update",
                    message: `Your order #${order.id.slice(-6).toUpperCase()} is now ${status}.`,
                    type: "ORDER"
                }
            });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("Missing ID", { status: 400 });

        await prisma.order.delete({
            where: { id }
        });

        return new NextResponse("Order deleted", { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
