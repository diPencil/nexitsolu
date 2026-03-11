import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = (session.user as any).id;

        const conversations = await prisma.conversation.findMany({
            where: { userId },
            include: {
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("Fetch user conversations error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
