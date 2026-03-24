import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { notifyAdmins } from "@/lib/notifications";
import { logBusinessActivity } from "@/lib/log-business-activity";

export async function POST(req: Request) {
    try {
        const { name, username, position, email, phone, whatsapp, governorate, password } = await req.json();

        if (!name || !username || !position || !email || !password) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const emailExists = await prisma.user.findUnique({
            where: { email },
        });

        if (emailExists) {
            return new NextResponse("Email already exists", { status: 400 });
        }

        const usernameExists = await prisma.user.findUnique({
            where: { username },
        });

        if (usernameExists) {
            return new NextResponse("Company name (username) already taken", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                username,     // This serves as the company name per user request
                position,     // Owner, Manager, etc.
                email,
                phone,        // Company's phone
                whatsapp,     // Company's Whatsapp
                governorate,
                password: hashedPassword,
                role: "COMPANY", // Assign distinct role for corporate registrations
            },
        });

        await notifyAdmins(
            "شركة جديدة", "New Company",
            `تم تسجيل شركة جديدة: ${name} (${username})`, `New company registered: ${name} (${username})`,
            "CUSTOMER"
        );

        await logBusinessActivity(
            {
                id: user.id,
                email: user.email,
                name: user.name,
                role: "COMPANY",
                username: user.username,
            },
            {
                action: "REGISTER_COMPANY",
                summary: `New company account: ${name} (@${username})`,
                resourceType: "User",
                resourceId: user.id,
                req,
            }
        );

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Corporate Registration error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
