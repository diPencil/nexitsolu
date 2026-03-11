import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { customerReply } = body;

        // Verify ownership
        const existingReview = await prisma.review.findUnique({
            where: { id }
        });

        if (!existingReview) {
            return new NextResponse("Review not found", { status: 404 });
        }

        if (existingReview.userId !== (session.user as any).id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        if (!existingReview.reply) {
            return new NextResponse("No admin reply to respond to", { status: 400 });
        }

        // Also create a message in the thread
        await prisma.reviewMessage.create({
            data: {
                reviewId: id,
                userId: (session.user as any).id,
                content: customerReply,
                role: "CUSTOMER"
            }
        });

        const review = await prisma.review.update({
            where: { id },
            data: {
                customerReply,
                customerReplyAt: new Date()
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error("[REVIEW_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
