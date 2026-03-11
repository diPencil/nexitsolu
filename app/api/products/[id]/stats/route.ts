import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { type } = await req.json();
        
        console.log(`[STATS_API] Request for ID: "${id}" type: "${type}"`);

        if (type !== 'view' && type !== 'share') {
            return new NextResponse(JSON.stringify({ error: "Invalid stat type" }), { status: 400 });
        }

        // Search for the product first to avoid P2025 error and for better logging
        const checkProduct = await prisma.product.findUnique({
            where: { id: id.trim() }
        });

        if (!checkProduct) {
            console.error(`Product with ID ${id} not found in database.`);
            return new NextResponse(JSON.stringify({ 
                error: "Product not found", 
                triedId: id 
            }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const product = await prisma.product.update({
            where: { id: id.trim() },
            data: {
                [type === 'view' ? 'views' : 'shares']: {
                    increment: 1
                }
            },
            select: {
                views: true,
                shares: true
            }
        });

        return NextResponse.json({ 
            success: true, 
            views: product.views, 
            shares: product.shares 
        });
    } catch (error: any) {
        console.error("Stats update error:", error);
        return new NextResponse(JSON.stringify({ 
            error: "Internal Server Error", 
            message: error.message,
            stack: error.stack
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
