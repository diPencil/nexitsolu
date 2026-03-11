import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const reviews = await prisma.review.findMany({
            include: {
                user: {
                    select: { name: true, username: true, email: true }
                },
                product: {
                    select: { name: true, nameAr: true, id: true }
                },
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("[ADMIN_REVIEWS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
