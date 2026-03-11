import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notifications";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return new NextResponse("Product ID required", { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: {
                productId,
                status: { in: ["APPROVED", "PENDING"] } // Fetch both to let UI show current user their own pending ones
            },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                        id: true
                    }
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
        console.error("[REVIEWS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { productId, rating, comment } = body;

        if (!productId || !rating || !comment) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                productId,
                rating: Number(rating),
                comment,
                userId: (session.user as any).id,
                status: "PENDING", // Require admin approval
            },
            include: {
                user: { select: { name: true, username: true } }
            }
        });

        await notifyAdmins(
            "تقييم جديد", "New Review",
            "تمت إضافة تقييم جديد لمنتج", "A new product review has been added",
            "REVIEW"
        );

        return NextResponse.json(review);
    } catch (error) {
        console.error("[REVIEWS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
