import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    logBusinessActivity,
    sessionUser,
} from "@/lib/log-business-activity";

// GET all products
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = session?.user && (session.user as any).role === "ADMIN";

        const products = await prisma.product.findMany({
            where: isAdmin ? {} : { active: true },
            include: {
                favoritedBy: { select: { id: true } },
                wishlistedBy: { select: { id: true } },
                reviews: { select: { id: true } },
                orderItems: {
                    where: { order: { status: "DELIVERED" } },
                    select: { quantity: true, price: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        // Map to include counts
        const productsWithCounts = products.map(p => ({
            ...p,
            favoriteCount: p.favoritedBy.length,
            wishlistCount: p.wishlistedBy.length,
            reviewCount: p.reviews.length,
            salesCount: p.orderItems.length,
            totalUnitsSold: p.orderItems.reduce((acc, item) => acc + item.quantity, 0),
            revenue: p.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
            favoritedBy: undefined, // Remove to keep response light
            wishlistedBy: undefined,
            reviews: undefined,
            orderItems: undefined
        }));

        return NextResponse.json(productsWithCounts);
    } catch (error) {
        console.error("Fetch products error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// POST new product (Admin only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { 
            name, 
            nameAr, 
            description, 
            descriptionAr, 
            price, 
            discountPrice,
            category, 
            image, 
            gallery,
            tag, 
            stock,
            active
        } = await req.json();

        const product = await prisma.product.create({
            data: {
                name,
                nameAr,
                description,
                descriptionAr,
                price: parseFloat(price),
                discountPrice: discountPrice ? parseFloat(discountPrice) : null,
                category,
                image,
                gallery,
                tag,
                stock: parseInt(stock),
                active: active !== undefined ? active : true
            },
        });

        await logBusinessActivity(sessionUser(session), {
            action: "PRODUCT_CREATE",
            summary: `Added product: ${product.name}`,
            resourceType: "Product",
            resourceId: product.id,
            req,
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
