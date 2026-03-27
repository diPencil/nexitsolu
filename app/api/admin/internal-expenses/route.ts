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

        const rows = await prisma.internalExpense.findMany({
            include: {
                createdBy: { select: { name: true, email: true } },
            },
            orderBy: { spentAt: "desc" },
        });
        return NextResponse.json(rows);
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const title = String(body.title || "").trim();
        const amount = Number(body.amount);
        if (!title || !Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json(
                { error: "Title and positive amount required" },
                { status: 400 }
            );
        }

        const spentAt = body.spentAt
            ? new Date(body.spentAt)
            : new Date();
        if (Number.isNaN(spentAt.getTime())) {
            return NextResponse.json({ error: "Invalid date" }, { status: 400 });
        }

        const row = await prisma.internalExpense.create({
            data: {
                title,
                amount,
                spentAt,
                category: body.category
                    ? String(body.category).trim() || null
                    : null,
                notes: body.notes ? String(body.notes).trim() || null : null,
                createdById: (session.user as any).id ?? null,
            },
            include: {
                createdBy: { select: { name: true, email: true } },
            },
        });

        await logBusinessActivity(sessionUser(session), {
            action: "INTERNAL_EXPENSE_CREATE",
            summary: `Internal expense: ${title} — ${amount} EGP`,
            resourceType: "InternalExpense",
            resourceId: row.id,
            req,
        });

        return NextResponse.json(row);
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const id = body.id as string | undefined;
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const data: Record<string, unknown> = {};
        if (body.title != null) {
            const t = String(body.title).trim();
            if (!t)
                return NextResponse.json(
                    { error: "Title cannot be empty" },
                    { status: 400 }
                );
            data.title = t;
        }
        if (body.amount != null) {
            const a = Number(body.amount);
            if (!Number.isFinite(a) || a <= 0) {
                return NextResponse.json(
                    { error: "Invalid amount" },
                    { status: 400 }
                );
            }
            data.amount = a;
        }
        if (body.spentAt != null) {
            const d = new Date(body.spentAt);
            if (Number.isNaN(d.getTime())) {
                return NextResponse.json(
                    { error: "Invalid date" },
                    { status: 400 }
                );
            }
            data.spentAt = d;
        }
        if (body.category !== undefined) {
            data.category = body.category
                ? String(body.category).trim() || null
                : null;
        }
        if (body.notes !== undefined) {
            data.notes = body.notes
                ? String(body.notes).trim() || null
                : null;
        }

        const row = await prisma.internalExpense.update({
            where: { id },
            data: data as any,
            include: {
                createdBy: { select: { name: true, email: true } },
            },
        });

        await logBusinessActivity(sessionUser(session), {
            action: "INTERNAL_EXPENSE_UPDATE",
            summary: `Updated internal expense ${row.title}`,
            resourceType: "InternalExpense",
            resourceId: row.id,
            req,
        });

        return NextResponse.json(row);
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
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
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const existing = await prisma.internalExpense.findUnique({
            where: { id },
            select: { title: true, amount: true },
        });
        await prisma.internalExpense.delete({ where: { id } });

        await logBusinessActivity(sessionUser(session), {
            action: "INTERNAL_EXPENSE_DELETE",
            summary: existing
                ? `Deleted internal expense: ${existing.title} (${existing.amount} EGP)`
                : `Deleted internal expense ${id}`,
            resourceType: "InternalExpense",
            resourceId: id,
            req,
        });

        return new NextResponse(null, { status: 204 });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
