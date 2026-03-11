import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = (session.user as any).id;

        const invoices = await prisma.invoice.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                order: { select: { id: true, total: true, status: true, orderNumber: true } }
            }
        });
        return NextResponse.json(invoices);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
