import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/notifications";
import { logBusinessActivity } from "@/lib/log-business-activity";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newContact = await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone,
                subject,
                message,
            },
        });

        await notifyAdmins(
            "تواصل معنا", "Contact Us",
            `رسالة جديدة من ${name}`, `New message from ${name}`,
            "CONTACT"
        );

        await logBusinessActivity(
            { email, name, role: "GUEST" },
            {
                action: "CONTACT_FORM",
                summary: `Contact form: ${name} (${email})${subject ? ` — ${subject}` : ""}`,
                resourceType: "ContactMessage",
                resourceId: newContact.id,
                req,
            }
        );

        return NextResponse.json(newContact, { status: 201 });
    } catch (error) {
        console.error("Error saving contact message:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
