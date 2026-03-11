import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(categories);
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

        const { name, nameAr, nameEn } = await req.json();

        const category = await prisma.category.create({
            data: {
                name,
                nameAr,
                nameEn
            }
        });

        return NextResponse.json(category);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Category slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id, name, nameAr, nameEn } = await req.json();

        const category = await prisma.category.update({
            where: { id },
            data: { name, nameAr, nameEn }
        });

        return NextResponse.json(category);
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

        await prisma.category.delete({
            where: { id }
        });

        return new NextResponse("Category deleted", { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
