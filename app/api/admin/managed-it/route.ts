import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const requests = await prisma.managedITRequest.findMany({
            include: {
                user: { select: { name: true, email: true, username: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(requests);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id, status } = await req.json();

        if (!id || !status) return new NextResponse("Missing fields", { status: 400 });

        const updated = await prisma.managedITRequest.update({
            where: { id },
            data: { status }
        });

        // Notify user
        if (updated.userId) {
            await prisma.notification.create({
                data: {
                    userId: updated.userId,
                    title: "Managed IT Request Status",
                    message: `Your request for ${updated.model} support is now ${status}.` + (status === 'ACCEPTED' ? ' Contact us to finalize the contract.' : ''),
                    type: "SYSTEM"
                }
            });
        }

        return NextResponse.json(updated);
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

        await prisma.managedITRequest.delete({ where: { id } });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
