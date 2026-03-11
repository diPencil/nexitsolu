import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" }
        })

        return NextResponse.json({ 
            success: true, 
            message: `User ${user.email} is now an ADMIN! Welcome to the club 👑`,
            role: user.role
        })
    } catch (error: any) {
        return NextResponse.json({ 
            error: "User not found or database error", 
            details: error.message 
        }, { status: 404 })
    }
}
