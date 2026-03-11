import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const data = await req.json();
        const userId = (session.user as any).id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                whatsapp: data.whatsapp,
                position: data.position,
                governorate: data.governorate,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
