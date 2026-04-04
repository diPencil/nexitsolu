import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sendMail } from "@/lib/mail"
import {
    logBusinessActivity,
    sessionUser,
} from "@/lib/log-business-activity"

function num(v: unknown): number {
    if (typeof v === "number" && Number.isFinite(v)) return v
    const n = parseFloat(String(v ?? ""))
    return Number.isFinite(n) ? n : 0
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await req.json()
        const q = await prisma.quotation.findUnique({
            where: { id },
            include: { user: true }
        })

        if (!q || !q.user) {
            return NextResponse.json({ error: "Quotation or user not found" }, { status: 404 })
        }

        const items = Array.isArray(q.items) ? (q.items as Record<string, unknown>[]) : []

        // Prepare email content
        const subject = `New Quotation: ${q.quotationNo} from NexIT Solutions`
        const html = `
            <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
                <div style="text-align: center; border-bottom: 2px solid #0066FF; padding-bottom: 20px; margin-bottom: 20px;">
                    <img src="https://nexitsolu.com/nexit-logo.png" alt="NexIT Solutions Logo" style="width: 180px; height: auto; margin-bottom: 10px;" />
                    <p style="color: #666; margin: 5px 0 0;">Innovative Systems & Digital Transformation</p>
                </div>
                
                <h2>Quotation details: ${q.quotationNo}</h2>
                <p>Hello ${q.user.name},</p>
                <p>We are pleased to provide you with the following quotation for the requested services/products. Please find the details below:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background: #f4f4f4;">
                            <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Description</th>
                            <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Qty</th>
                            <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">Price</th>
                            <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((item) => {
                            const qty = num(item.quantity)
                            const price = num(item.price)
                            const desc = String(item.description ?? "")
                            return `
                            <tr>
                                <td style="padding: 12px; border: 1px solid #ddd;">${desc}</td>
                                <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${qty}</td>
                                <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${price.toFixed(2)}</td>
                                <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${(qty * price).toFixed(2)}</td>
                            </tr>`
                        }).join("")}
                    </tbody>
                    <tfoot>
                        ${num(q.subtotal) !== 0 ? `
                        <tr>
                            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Subtotal:</td>
                            <td style="padding: 12px; text-align: right;">${num(q.subtotal).toFixed(2)} EGP</td>
                        </tr>` : ''}
                        ${num(q.discount) !== 0 ? `
                        <tr>
                            <td colspan="3" style="padding: 12px; text-align: right; color: #10b981; font-weight: bold;">Discount:</td>
                            <td style="padding: 12px; text-align: right; color: #10b981;">- ${num(q.discount).toFixed(2)} EGP</td>
                        </tr>` : ''}
                        ${num(q.tax) !== 0 ? `
                        <tr>
                            <td colspan="3" style="padding: 12px; text-align: right; color: #eab308; font-weight: bold;">Tax:</td>
                            <td style="padding: 12px; text-align: right; color: #eab308;">+ ${(num(q.subtotal) * num(q.tax) / 100).toFixed(2)} EGP (${num(q.tax)}%)</td>
                        </tr>` : ''}
                        <tr style="background: #0066FF; color: white;">
                            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; font-size: 1.2em;">Total:</td>
                            <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 1.2em;">${num(q.amount).toFixed(2)} EGP</td>
                        </tr>
                    </tfoot>
                </table>
                
                ${q.notes ? `
                <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #0066FF; margin-bottom: 20px;">
                    <p style="margin: 0; font-weight: bold; font-size: 0.9em; color: #0066FF;">ADDITIONAL NOTES:</p>
                    <p style="margin: 5px 0 0; color: #555; white-space: pre-wrap;">${q.notes}</p>
                </div>` : ''}
                
                ${q.validUntil ? `<p style="color: #ef4444; font-weight: bold;">* This quotation is valid until: ${new Date(q.validUntil).toLocaleDateString()}</p>` : ''}
                
                <p>If you have any questions, please don't hesitate to contact us at sales@nexitsolu.com</p>
                <p style="margin-top: 30px;">Best regards,<br/><strong>NexIT Solutions Team</strong></p>
            </div>
        `

        const result = await sendMail(q.user.email, subject, html)
        if (result.success) {
            await prisma.quotation.update({
                where: { id },
                data: { status: "SENT" }
            })
            await logBusinessActivity(sessionUser(session), {
                action: "QUOTATION_EMAIL_SENT",
                summary: `Emailed quotation ${q.quotationNo} to ${q.user.email}`,
                resourceType: "Quotation",
                resourceId: q.id,
                req,
            })
            return NextResponse.json({ message: "Quotation sent successfully" })
        } else {
            console.error("Mail send failed:", result.error)
            const error = result.error as any
            return NextResponse.json({
                error: error?.message || String(result.error) || "Failed to send email",
                code: error?.code || null,
                response: error?.response || null,
            }, { status: 500 })
        }

    } catch (error: any) {
        console.error("API error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
