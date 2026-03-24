import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { notifyAdmins } from "@/lib/notifications";
import {
    logBusinessActivity,
    sessionUser,
} from "@/lib/log-business-activity";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get("conversationId");
        const userId = (session.user as any).id;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ],
                ...(conversationId ? { conversationId } : {})
            },
            orderBy: { createdAt: "desc" },
            include: {
                sender: { select: { id: true, name: true, role: true } },
                receiver: { select: { id: true, name: true, role: true } },
                conversation: true
            }
        });

        return NextResponse.json(messages);
    } catch (error: any) {
        console.error("Fetch messages error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { content } = await req.json();

        if (!content) {
            return new NextResponse("Missing content", { status: 400 });
        }

        const userId = (session.user as any).id;

        // Find or create an active conversation (OPEN ticket)
        let conversation = await prisma.conversation.findFirst({
            where: {
                userId,
                status: "OPEN"
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!conversation) {
            // Create a new ticket with a unique ID
            const ticketCount = await prisma.conversation.count();
            const ticketId = `NEX-${1000 + ticketCount + 1}`;
            
            conversation = await prisma.conversation.create({
                data: {
                    userId,
                    ticketId,
                    status: "OPEN"
                }
            });
        }

        // Find an admin to receive the message
        const adminUser = await prisma.user.findFirst({
            where: { role: "ADMIN" }
        });

        if (!adminUser) {
            return new NextResponse("No admin found to receive message", { status: 500 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId: userId,
                receiverId: adminUser.id,
                conversationId: conversation.id
            },
            include: {
                sender: { select: { id: true, name: true, role: true } },
                receiver: { select: { id: true, name: true, role: true } },
                conversation: true
            }
        });

        // Trigger real-time via Pusher (optional/soft-fail)
        try {
            const { pusherServer } = require("@/lib/pusher");
            
            // Broadcast to the specific conversation channel
            await pusherServer.trigger(`conversation-${conversation.id}`, "new-message", message);
            
            // Also notify the specific user
            await pusherServer.trigger(`user-${userId}`, "new-message", message);
            
            // Notify ADMIN of new message/ticket
            await pusherServer.trigger(`admin-messages`, "new-conversation", {
                ...message,
                conversation
            });
        } catch (pusherError) {
            console.warn("Pusher notification failed, but message was saved:", pusherError);
        }

        await notifyAdmins(
            "رسالة جديدة", "New Message",
            `رسالة جديدة من ${(session.user as any).name}`, `New message from ${(session.user as any).name}`,
            "MESSAGE"
        );

        const ticketLabel = conversation.ticketId || conversation.id;
        await logBusinessActivity(sessionUser(session), {
            action: "MESSAGE_SEND",
            summary: `Chat message (${ticketLabel})`,
            resourceType: "Message",
            resourceId: message.id,
            metadata: { conversationId: conversation.id },
            req,
        });

        return NextResponse.json(message);
    } catch (error: any) {
        console.error("Send message error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
