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
        if (!session || (session.user as { role?: string }).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const suppliers = await prisma.supplier.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(suppliers);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as { role?: string }).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const body = await req.json();
        const { name, contact, email, phone, address } = body;
        if (!name?.trim()) {
            return NextResponse.json({ error: "Name required" }, { status: 400 });
        }
        const supplier = await prisma.supplier.create({
            data: {
                name: name.trim(),
                contact: contact || null,
                email: email || null,
                phone: phone || null,
                address: address || null,
            },
        });
        const actor = sessionUser(session);
        await logBusinessActivity(actor, {
            action: "SUPPLIER_CREATE",
            summary: `Added supplier: ${supplier.name}`,
            resourceType: "Supplier",
            resourceId: supplier.id,
            req,
        });
        return NextResponse.json(supplier);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as { role?: string }).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const body = await req.json();
        const { id, name, contact, email, phone, address } = body;
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }
        const supplier = await prisma.supplier.update({
            where: { id },
            data: {
                name: name?.trim() ?? undefined,
                contact: contact ?? undefined,
                email: email ?? undefined,
                phone: phone ?? undefined,
                address: address ?? undefined,
            },
        });
        const actor = sessionUser(session);
        await logBusinessActivity(actor, {
            action: "SUPPLIER_UPDATE",
            summary: `Updated supplier: ${supplier.name}`,
            resourceType: "Supplier",
            resourceId: supplier.id,
            req,
        });
        return NextResponse.json(supplier);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as { role?: string }).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const id = new URL(req.url).searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }
        const existing = await prisma.supplier.findUnique({ where: { id } });
        await prisma.supplier.delete({ where: { id } });
        const actor = sessionUser(session);
        await logBusinessActivity(actor, {
            action: "SUPPLIER_DELETE",
            summary: existing
                ? `Deleted supplier: ${existing.name}`
                : `Deleted supplier id ${id}`,
            resourceType: "Supplier",
            resourceId: id,
            req,
        });
        return new NextResponse("Deleted", { status: 200 });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
