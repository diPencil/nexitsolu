import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { reason } = await req.json();
        const { id: conversationId } = await params;

        // Update conversation status
        const updatedConversation = await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                status: "CLOSED",
                closedReason: reason,
                updatedAt: new Date()
            }
        });

        // Send notifications
        try {
            await pusherServer.trigger(`conversation-${conversationId}`, "conversation-closed", {
                id: conversationId,
                reason,
                closedAt: new Date()
            });

            // Also trigger on the user's personal channel
            await pusherServer.trigger(`user-${updatedConversation.userId}`, "conversation-closed", {
                id: conversationId,
                reason,
                closedAt: new Date()
            });
        } catch (pusherError) {
            console.warn("Pusher notification failed, but status was updated:", pusherError);
        }

        return NextResponse.json(updatedConversation);
    } catch (error: any) {
        console.error("Close conversation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
