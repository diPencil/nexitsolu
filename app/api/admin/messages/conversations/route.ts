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

        const adminId = (session.user as any).id;

        // Fetch all conversations with their user and messages
        const convs = await prisma.conversation.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        const conversations = convs.map(c => ({
            id: c.id,
            ticketId: c.ticketId,
            userId: c.userId,
            name: c.user.name,
            email: c.user.email,
            status: c.status,
            closedReason: c.closedReason,
            lastMsg: c.messages[0]?.content || "No messages",
            time: c.messages[0] ? new Date(c.messages[0].createdAt).toLocaleTimeString() : new Date(c.createdAt).toLocaleTimeString(),
            updatedAt: c.updatedAt
        }));

        return NextResponse.json(conversations);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
