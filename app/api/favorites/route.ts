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
        const favorites = await prisma.favorite.findMany({
            where: { userId: (session.user as any).id },
            include: { product: true }
        });
        return NextResponse.json(favorites);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
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

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });

        if (existing) {
            await prisma.favorite.delete({
                where: { id: existing.id }
            });
            return NextResponse.json({ message: "Removed from favorites", status: 'removed' });
        } else {
            await prisma.favorite.create({
                data: { userId, productId }
            });
            return NextResponse.json({ message: "Added to favorites", status: 'added' });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
    }
}
