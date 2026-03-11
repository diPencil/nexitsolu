import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { notifyAdmins } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const data = await req.json();

        let userId = (session?.user as any)?.id;

        // If guest submission (no session), find or create a user account
        if (!userId) {
            if (!data.email) {
                return new NextResponse("Email is required for guest submission", { status: 400 });
            }

            // Check if user exists
            let user = await prisma.user.findUnique({
                where: { email: data.email }
            });

            if (!user) {
                // Auto-create a corporate account
                const hashedPassword = await bcrypt.hash("NexitGuest123!", 10);
                user = await prisma.user.create({
                    data: {
                        email: data.email,
                        password: hashedPassword,
                        name: data.contactName, // Use contact person as name
                        username: data.companyName, // Use company as username
                        phone: data.phone,
                        role: "COMPANY"
                    }
                });
            }
            userId = user.id;
        }
        
        const request = await prisma.managedITRequest.create({
            data: {
                userId: userId,
                companyName: data.companyName,
                industry: data.industry,
                services: JSON.stringify(data.services),
                model: data.model,
                days: data.days,
                hours: data.hours,
                contactName: data.contactName,
                email: data.email,
                phone: data.phone,
            }
        });

        await notifyAdmins(
            "طلب Managed IT", "Managed IT Request",
            `طلب إدارة تقنية جديد من شركة ${data.companyName}`, `New managed IT request from ${data.companyName}`,
            "MANAGED_IT"
        );

        return NextResponse.json(request);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const requests = await prisma.managedITRequest.findMany({
            where: {
                userId: (session.user as any).id,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(requests || []);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
