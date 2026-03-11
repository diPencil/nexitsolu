import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: (session.user as any).id,
                status: "ACTIVE"
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(subscriptions || []);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
