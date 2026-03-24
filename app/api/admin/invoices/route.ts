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

        const invoices = await prisma.invoice.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true, role: true } },
                order: { select: { id: true, total: true, status: true } }
            }
        });
        return NextResponse.json(invoices);
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

        const { invoiceNo, userId, orderId, amount, status, notes, dueDate, fileUrl, items, subtotal, discount, tax } = await req.json();

        // Verify user is a company (optional but good based on request)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user || user.role !== "COMPANY") {
            // return NextResponse.json({ error: "Invoices can only be sent to companies" }, { status: 400 });
            // Actually, let's allow it but warn or just follow the request.
        }

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNo,
                userId,
                orderId: orderId || null,
                amount: parseFloat(amount),
                status: status || "PENDING",
                notes,
                fileUrl,
                dueDate: dueDate ? new Date(dueDate) : null,
                items: items ? items : null,
                subtotal: subtotal ? parseFloat(subtotal) : null,
                discount: discount ? parseFloat(discount) : null,
                tax: tax ? parseFloat(tax) : null
            }
        });

        // Send notification
        await prisma.notification.create({
            data: {
                userId,
                title: "New Invoice | فاتورة جديدة",
                message: `You have received a new invoice #${invoiceNo} | لقد استلمت فاتورة جديدة برقم ${invoiceNo}`,
                type: "INVOICE"
            }
        });

        await logBusinessActivity(sessionUser(session), {
            action: "INVOICE_CREATE",
            summary: `Created invoice #${invoiceNo} for user ${userId}`,
            resourceType: "Invoice",
            resourceId: invoice.id,
            req,
        });

        return NextResponse.json(invoice);
    } catch (error: any) {
        console.error("Invoice creation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id, status, amount, notes, dueDate, fileUrl, items, subtotal, discount, tax } = await req.json();

        const invoice = await prisma.invoice.update({
            where: { id },
            data: {
                status,
                amount: amount ? parseFloat(amount) : undefined,
                notes,
                fileUrl,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                items: items !== undefined ? items : undefined,
                subtotal: subtotal !== undefined ? parseFloat(subtotal) : undefined,
                discount: discount !== undefined ? parseFloat(discount) : undefined,
                tax: tax !== undefined ? parseFloat(tax) : undefined
            }
        });

        await logBusinessActivity(sessionUser(session), {
            action: "INVOICE_UPDATE",
            summary: `Updated invoice #${invoice.invoiceNo}${status ? ` (${status})` : ""}`,
            resourceType: "Invoice",
            resourceId: invoice.id,
        });

        return NextResponse.json(invoice);
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

        const existing = await prisma.invoice.findUnique({
            where: { id },
            select: { invoiceNo: true },
        });

        await prisma.invoice.delete({
            where: { id }
        });

        await logBusinessActivity(sessionUser(session), {
            action: "INVOICE_DELETE",
            summary: existing
                ? `Deleted invoice #${existing.invoiceNo}`
                : `Deleted invoice ${id}`,
            resourceType: "Invoice",
            resourceId: id,
            req,
        });

        return new NextResponse("Invoice deleted", { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
