import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { sendMail } from "@/lib/mail"

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const { name, email, phone, company, service, message } = data

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 1. Save to DB
        const request = await prisma.quotationRequest.create({
            data: {
                name,
                email,
                phone,
                company,
                service,
                message,
                status: "PENDING"
            }
        })

        // 2. Send notification email to Admin
        const adminSubject = `New Quotation Request: ${company || name}`
        const adminHtml = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #0066FF;">New Quotation Request</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
                <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #0066FF;">
                    <p style="margin: 0; font-weight: bold;">Message:</p>
                    <p style="margin: 5px 0 0; white-space: pre-wrap;">${message}</p>
                </div>
                <p style="margin-top: 20px; font-size: 0.8em; color: #666;">This request was submitted from the NexIT Website.</p>
            </div>
        `

        await sendMail(process.env.SMTP_USER || "sales@nexitsolu.com", adminSubject, adminHtml)

        // 3. Send confirmation to user
        const userSubject = `We've received your quotation request - NexIT Solutions`
        const userHtml = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <div style="text-align: center; border-bottom: 2px solid #0066FF; padding-bottom: 20px;">
                    <h1 style="color: #0066FF; margin: 0;">NexIT Solutions</h1>
                </div>
                <p>Hello ${name},</p>
                <p>Thank you for reaching out to us. We have received your request for a quotation regarding <strong>${service || 'our services'}</strong>.</p>
                <p>One of our team members will review your details and get back to you shortly with more information or a formal quotation.</p>
                
                <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold;">Request Details:</p>
                    <p style="margin: 5px 0 0; font-size: 0.9em; color: #555;">${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
                </div>
                
                <p>Best regards,<br/><strong>NexIT Solutions Team</strong></p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 0.8em; color: #999; text-align: center;">Innovating for the Future | <a href="https://nexitsolu.com" style="color: #0066FF; text-decoration: none;">nexitsolu.com</a></p>
            </div>
        `
        await sendMail(email, userSubject, userHtml)

        return NextResponse.json({ success: true, id: request.id })

    } catch (error: any) {
        console.error("Quotation request error:", error)
        return NextResponse.json({ error: "Failed to submit request" }, { status: 500 })
    }
}
