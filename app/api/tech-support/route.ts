import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, whatsapp, supportType, message } = body;

        if (!name || !email || !supportType || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newRequest = await prisma.techSupportRequest.create({
            data: {
                name,
                email,
                phone,
                whatsapp,
                supportType,
                message,
            },
        });

        await notifyAdmins(
            "تذكرة دعم فني", "Tech Support Ticket",
            `طلب دعم فني جديد من ${name} بخصوص ${supportType}`, `New tech support request from ${name} regarding ${supportType}`,
            "SUPPORT"
        );

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.error("Error saving tech support request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
