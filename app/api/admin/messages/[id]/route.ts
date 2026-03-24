import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import {
    logBusinessActivity,
    sessionUser,
} from "@/lib/log-business-activity";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: conversationId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId
            },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { content } = await req.json();
        const { id: conversationId } = await params;
        const adminId = (session.user as any).id;

        // Verify conversation exists
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId }
        });

        if (!conversation) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId: adminId,
                receiverId: conversation.userId,
                conversationId: conversationId
            }
        });

        // Update conversation's updatedAt
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });

        // Trigger real-time via Pusher
        try {
            await pusherServer.trigger(`conversation-${conversationId}`, "new-message", message);
            // Also notify the user specifically
            await pusherServer.trigger(`user-${conversation.userId}`, "new-message", message);
        } catch (pusherError) {
            console.warn("Pusher notification failed, but message was saved:", pusherError);
        }

        await logBusinessActivity(sessionUser(session), {
            action: "ADMIN_MESSAGE_REPLY",
            summary: `Admin reply in ticket ${conversation.ticketId || conversationId}`,
            resourceType: "Message",
            resourceId: message.id,
            metadata: { conversationId },
        });

        return NextResponse.json(message);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
