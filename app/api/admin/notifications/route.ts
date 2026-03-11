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

        const notifications = await prisma.notification.findMany({
            where: {
                userId: (session.user as any).id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(notifications);
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

        let data: any = {};
        try {
            data = await req.json();
        } catch (e) {
            // No body is fine for "Mark all as read"
        }
        
        const { id } = data;

        if (id) {
            await prisma.notification.update({
                where: { id },
                data: { read: true }
            });
        } else {
            // Mark all as read for the current admin
            await prisma.notification.updateMany({
                where: { userId: (session.user as any).id },
                data: { read: true }
            });
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error", { status: 500 });
    }
}
