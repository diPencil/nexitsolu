import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const userId = (session.user as any).id;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordCorrect) {
            return new NextResponse("Incorrect current password", { status: 400 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return new NextResponse("Password updated successfully", { status: 200 });
    } catch (error: any) {
        console.error("Change password error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
