import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { notifyAdmins } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const { name, username, email, phone, governorate, password } = await req.json();

        if (!name || !username || !email || !password) {
            return new NextResponse("Missing fields", { status: 400 });
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
            return new NextResponse("Username already taken", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                phone,
                governorate,
                password: hashedPassword,
                role: "CUSTOMER", // Default role
            },
        });

        await notifyAdmins(
            "عميل جديد", "New Customer",
            `تم تسجيل عميل جديد: ${name} (${email})`, `New customer registered: ${name} (${email})`,
            "CUSTOMER"
        );

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Registration error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
