import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyAdmins } from "@/lib/notifications";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const subscriptions = await prisma.subscription.findMany({
            include: {
                user: { select: { name: true, email: true, username: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(subscriptions);
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

        const body = await req.json();
        const { userId, planName, amount, type, durationMonths } = body;

        if (!userId || !planName || !amount) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + (parseInt(durationMonths) || 1));

        const sub = await prisma.subscription.create({
            data: {
                userId,
                planName,
                amount: parseFloat(amount),
                type, // MONTHLY, YEARLY
                endDate,
                status: "ACTIVE"
            }
        });

        // Notify User
        await prisma.notification.create({
            data: {
                userId,
                title: "New Subscription",
                message: `Admin has added a new active plan: ${planName}. It expires on ${endDate.toLocaleDateString()}.`,
                type: "SYSTEM"
            }
        });

        await notifyAdmins(
            "اشتراك جديد", "New Subscription",
            `تم تفعيل خطة ${planName}`, `Plan ${planName} has been activated`,
            "SUBSCRIPTION"
        );

        return NextResponse.json(sub);
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

        const body = await req.json();
        const { id, planName, amount, type, status } = body;

        if (!id) return new NextResponse("Missing ID", { status: 400 });

        const sub = await prisma.subscription.update({
            where: { id },
            data: {
                planName,
                amount: amount ? parseFloat(amount) : undefined,
                type,
                status // End users might want to reactivate
            }
        });

        return NextResponse.json(sub);
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

        // User specifically asked not to delete, but to "stop" it.
        await prisma.subscription.update({
            where: { id },
            data: { status: "ENDED" }
        });

        return new NextResponse("Terminated", { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
