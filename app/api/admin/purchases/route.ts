import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
    logBusinessActivity,
    sessionUser,
} from "@/lib/log-business-activity";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const purchases = await prisma.purchase.findMany({
            include: {
                supplier: { select: { name: true } },
                product: { select: { name: true, nameAr: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(purchases);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const data = await req.json();
        const { supplierId, productId, quantity, unitPrice, status } = data;

        // Transaction to ensure both purchase is recorded and stock is updated
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Purchase record
            const purchase = await tx.purchase.create({
                data: {
                    supplierId,
                    productId,
                    quantity,
                    unitPrice,
                    totalPrice: quantity * unitPrice,
                    status: status || "COMPLETED"
                }
            });

            // 2. Increment Product stock (only if status is COMPLETED)
            if (status === "COMPLETED" || !status) {
                await tx.product.update({
                    where: { id: productId },
                    data: {
                        stock: { increment: Number(quantity) }
                    }
                });
            }

            return purchase;
        });

        const [sup, prod] = await Promise.all([
            prisma.supplier.findUnique({
                where: { id: supplierId },
                select: { name: true },
            }),
            prisma.product.findUnique({
                where: { id: productId },
                select: { name: true },
            }),
        ]);
        await logBusinessActivity(sessionUser(session), {
            action: "PURCHASE_RECORD",
            summary: `Supply: ${quantity}× ${prod?.name ?? productId} from ${sup?.name ?? supplierId}`,
            resourceType: "Purchase",
            resourceId: result.id,
            req,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("Missing ID", { status: 400 });

        const existing = await prisma.purchase.findUnique({
            where: { id },
            include: {
                supplier: { select: { name: true } },
                product: { select: { name: true } },
            },
        });

        // Note: We don't automatically decrement stock on delete for safety 
        // Admin should manually adjust if needed or we could add that logic
        await prisma.purchase.delete({
            where: { id }
        });

        await logBusinessActivity(sessionUser(session), {
            action: "PURCHASE_DELETE",
            summary: existing
                ? `Deleted purchase: ${existing.product.name} / ${existing.supplier.name}`
                : `Deleted purchase ${id}`,
            resourceType: "Purchase",
            resourceId: id,
            req,
        });

        return new NextResponse("Purchase record deleted", { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
