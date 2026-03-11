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

        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { status, reply, comment } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (reply !== undefined) {
            updateData.reply = reply;
            // Also create a message in the thread
            await prisma.reviewMessage.create({
                data: {
                    reviewId: id,
                    userId: (session.user as any).id,
                    content: reply,
                    role: "ADMIN"
                }
            });
        }
        if (comment !== undefined) updateData.comment = comment;

        const review = await prisma.review.update({
            where: {
                id,
            },
            data: updateData,
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error("[ADMIN_REVIEW_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const review = await prisma.review.delete({
            where: {
                id,
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error("[ADMIN_REVIEW_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
