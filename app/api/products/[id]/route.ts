import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        const isAdmin = session?.user && (session.user as any).role === "ADMIN";

        const product = await prisma.product.findUnique({
            where: { 
                id,
                ...(isAdmin ? {} : { active: true })
            },
            include: {
                favoritedBy: { select: { id: true } },
                wishlistedBy: { select: { id: true } },
                reviews: { select: { id: true } },
                orderItems: {
                    where: { order: { status: "DELIVERED" } },
                    select: { quantity: true, price: true }
                }
            }
        });

        if (!product) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const productWithCounts = {
            ...product,
            favoriteCount: product.favoritedBy.length,
            wishlistCount: product.wishlistedBy.length,
            reviewCount: product.reviews.length,
            totalUnitsSold: product.orderItems.reduce((acc, item) => acc + item.quantity, 0),
            revenue: product.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
            favoritedBy: undefined,
            wishlistedBy: undefined,
            reviews: undefined,
            orderItems: undefined
        };

        return NextResponse.json(productWithCounts);
    } catch (error) {
        console.error("Fetch product error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        // Safely destructure data needed to update product.
        const { 
            name, nameAr, description, descriptionAr, 
            price, discountPrice, category, image, 
            gallery, tag, stock, shippingZones, active 
        } = body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                nameAr,
                description,
                descriptionAr,
                price: price ? parseFloat(price) : undefined,
                discountPrice: discountPrice !== undefined ? (discountPrice ? parseFloat(discountPrice) : null) : undefined,
                category,
                image,
                gallery,
                tag,
                stock: stock !== undefined ? parseInt(stock) : undefined,
                shippingZones,
                active: active !== undefined ? active : undefined
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Update product error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        // Perform cascading deletion manually since we aren't using onDelete: Cascade in Prisma
        await prisma.favorite.deleteMany({ where: { productId: id } });
        await prisma.wishlist.deleteMany({ where: { productId: id } });
        await prisma.reviewMessage.deleteMany({ where: { review: { productId: id } } });
        await prisma.review.deleteMany({ where: { productId: id } });
        await prisma.orderItem.deleteMany({ where: { productId: id } });

        // Perform the deletion of the product itself
        await prisma.product.delete({
            where: { id }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("Delete product error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
