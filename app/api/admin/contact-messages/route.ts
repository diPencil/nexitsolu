import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching contact messages:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const updated = await prisma.contactMessage.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating contact message:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new NextResponse("Missing id", { status: 400 });
        }

        await prisma.contactMessage.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting contact message:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
