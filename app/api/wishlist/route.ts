import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const items = await prisma.wishlist.findMany({
            where: { userId: (session.user as any).id },
            include: { product: true }
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { productId } = await req.json();
        const userId = (session.user as any).id;

        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });

        if (existing) {
            await prisma.wishlist.delete({
                where: { id: existing.id }
            });
            return NextResponse.json({ message: "Removed from wishlist", status: 'removed' });
        } else {
            await prisma.wishlist.create({
                data: { userId, productId }
            });
            return NextResponse.json({ message: "Added to wishlist", status: 'added' });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to toggle wishlist" }, { status: 500 });
    }
}
