import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notifications";
import {
    logBusinessActivity,
    sessionUser,
} from "@/lib/log-business-activity";

const DEPOSIT_PERCENT = 30;

function round2(n: number) {
    return Math.round(n * 100) / 100;
}

function nearlyEqual(a: number, b: number, eps = 0.02) {
    return Math.abs(a - b) <= eps;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: (session.user as any).id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            items,
            total,
            shippingFee,
            paidAmount,
            paymentMethod,
            paymentType,
            senderPhone,
            transactionId,
            shippingName,
            shippingPhone,
            shippingAddress,
            shippingCity,
        } = body;

        const missing =
            !Array.isArray(items) ||
            items.length === 0 ||
            !String(shippingName || "").trim() ||
            !String(shippingPhone || "").trim() ||
            !String(shippingAddress || "").trim() ||
            !String(shippingCity || "").trim();
        if (missing) {
            return NextResponse.json(
                { error: "Invalid order payload" },
                { status: 400 }
            );
        }

        const zone = await prisma.shippingZone.findFirst({
            where: { name: String(shippingCity), isActive: true },
        });
        if (!zone) {
            return NextResponse.json(
                { error: "Invalid shipping location" },
                { status: 400 }
            );
        }

        const fee = Number(shippingFee);
        if (Number.isNaN(fee) || !nearlyEqual(fee, zone.price)) {
            return NextResponse.json(
                { error: "Shipping fee mismatch" },
                { status: 400 }
            );
        }

        type Line = { productId: string; quantity: number; price: number };
        const validatedLines: Line[] = [];

        for (const item of items) {
            const qty = parseInt(String(item.quantity), 10);
            if (!item.productId || !Number.isFinite(qty) || qty < 1) {
                return NextResponse.json(
                    { error: "Invalid cart item" },
                    { status: 400 }
                );
            }

            const product = await prisma.product.findUnique({
                where: { id: String(item.productId) },
            });
            if (!product || !product.active) {
                return NextResponse.json(
                    { error: "Product unavailable" },
                    { status: 400 }
                );
            }
            if (product.stock < qty) {
                return NextResponse.json(
                    { error: "Insufficient stock for " + product.name },
                    { status: 400 }
                );
            }

            const unit =
                product.discountPrice != null
                    ? product.discountPrice
                    : product.price;
            validatedLines.push({
                productId: product.id,
                quantity: qty,
                price: unit,
            });
        }

        const subtotal = round2(
            validatedLines.reduce((s, l) => s + l.price * l.quantity, 0)
        );
        const serverTotal = round2(subtotal + zone.price);

        if (!nearlyEqual(Number(total), serverTotal)) {
            return NextResponse.json(
                { error: "Order total mismatch — refresh and try again" },
                { status: 400 }
            );
        }

        const method = (paymentMethod ?? "CASH_ON_DELIVERY") as string;
        if (
            !["CASH_ON_DELIVERY", "EWALLET", "INSTAPAY"].includes(method)
        ) {
            return NextResponse.json(
                { error: "Invalid payment method" },
                { status: 400 }
            );
        }

        let pType = (paymentType ?? "FULL") as string;
        if (method === "CASH_ON_DELIVERY") {
            pType = "FULL";
        }
        if (pType !== "FULL" && pType !== "DEPOSIT") {
            return NextResponse.json(
                { error: "Invalid payment type" },
                { status: 400 }
            );
        }

        const depositPart = round2((serverTotal * DEPOSIT_PERCENT) / 100);
        const expectedPaid = pType === "FULL" ? serverTotal : depositPart;

        if (!nearlyEqual(Number(paidAmount ?? 0), expectedPaid)) {
            return NextResponse.json(
                { error: "Paid amount does not match selected payment option" },
                { status: 400 }
            );
        }

        let trimmedSender: string | null = null;
        let trimmedTx: string | null = null;
        if (method === "EWALLET" || method === "INSTAPAY") {
            trimmedSender = String(senderPhone || "").trim();
            trimmedTx = String(transactionId || "").trim();
            if (!trimmedSender || !trimmedTx) {
                return NextResponse.json(
                    { error: "Sender phone and transaction ID are required" },
                    { status: 400 }
                );
            }
        }

        const userId = (session.user as any).id;

        const order = await prisma.$transaction(async (tx) => {
            for (const line of validatedLines) {
                const upd = await tx.product.updateMany({
                    where: {
                        id: line.productId,
                        stock: { gte: line.quantity },
                    },
                    data: { stock: { decrement: line.quantity } },
                });
                if (upd.count !== 1) {
                    throw new Error("STOCK_CONFLICT");
                }
            }

            const orderCount = await tx.order.count();
            const orderNumber = `NEX-${String(orderCount + 1001).padStart(4, "0")}`;

            return tx.order.create({
                data: {
                    userId,
                    total: serverTotal,
                    orderNumber,
                    paidAmount: expectedPaid,
                    paymentMethod: method,
                    paymentType: pType,
                    senderPhone: trimmedSender,
                    transactionId: trimmedTx,
                    shippingName: String(shippingName).trim(),
                    shippingPhone: String(shippingPhone).trim(),
                    shippingAddress: String(shippingAddress).trim(),
                    shippingCity: String(shippingCity).trim(),
                    status: "PENDING",
                    items: {
                        create: validatedLines.map((line) => ({
                            productId: line.productId,
                            quantity: line.quantity,
                            price: line.price,
                        })),
                    },
                },
                include: {
                    items: { include: { product: true } },
                    user: { select: { name: true, email: true } },
                },
            });
        });

        await notifyAdmins(
            "طلب جديد",
            "New Order",
            `طلب جديد ${order.orderNumber} من ${order.user.name || order.user.email} - ${serverTotal} EGP`,
            `New order ${order.orderNumber} from ${order.user.name || order.user.email} - ${serverTotal} EGP`,
            "ORDER"
        );

        await logBusinessActivity(sessionUser(session), {
            action: "ORDER_CREATE",
            summary: `Placed order ${order.orderNumber} — ${serverTotal} EGP`,
            resourceType: "Order",
            resourceId: order.id,
            req,
        });

        return NextResponse.json(order);
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error && error.message === "STOCK_CONFLICT") {
            return NextResponse.json(
                {
                    error:
                        "An item just went out of stock — please update your cart and try again",
                },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
