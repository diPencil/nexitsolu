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
        const inv = await prisma.invoice.findUnique({
            where: { id },
            include: { user: true }
        })

        if (!inv || !inv.user) {
            return NextResponse.json({ error: "Invoice or user not found" }, { status: 404 })
        }

        const items = Array.isArray(inv.items) ? (inv.items as Record<string, unknown>[]) : []

        // Prepare email content
        const subject = `New Invoice: ${inv.invoiceNo} from NexIT Solutions`
        const html = `
            <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
                <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px;">
                    <img src="https://nexitsolu.com/nexit-logo.png" alt="NexIT Solutions Logo" style="width: 180px; height: auto; margin-bottom: 10px;" />
                    <p style="color: #666; margin: 5px 0 0;">Innovative Systems & Digital Transformation</p>
                </div>
                
                <h2>Invoice details: ${inv.invoiceNo}</h2>
                <p>Hello ${inv.user.name},</p>
                <p>You have received a new invoice from NexIT Solutions. Please find the details below:</p>
                
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
                        ${num(inv.subtotal) !== 0 ? `
                        <tr>
                            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Subtotal:</td>
                            <td style="padding: 12px; text-align: right;">${num(inv.subtotal).toFixed(2)} EGP</td>
                        </tr>` : ''}
                        ${num(inv.discount) !== 0 ? `
                        <tr>
                            <td colspan="3" style="padding: 12px; text-align: right; color: #10b981; font-weight: bold;">Discount:</td>
                            <td style="padding: 12px; text-align: right; color: #10b981;">- ${num(inv.discount).toFixed(2)} EGP</td>
                        </tr>` : ''}
                        ${num(inv.tax) !== 0 ? `
                        <tr>
                            <td colspan="3" style="padding: 12px; text-align: right; color: #eab308; font-weight: bold;">Tax:</td>
                            <td style="padding: 12px; text-align: right; color: #eab308;">+ ${(num(inv.subtotal) * num(inv.tax) / 100).toFixed(2)} EGP (${num(inv.tax)}%)</td>
                        </tr>` : ''}
                        <tr style="background: #3b82f6; color: white;">
                            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; font-size: 1.2em;">Total:</td>
                            <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 1.2em;">${num(inv.amount).toFixed(2)} EGP</td>
                        </tr>
                    </tfoot>
                </table>
                
                ${inv.notes ? `
                <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
                    <p style="margin: 0; font-weight: bold; font-size: 0.9em; color: #3b82f6;">NOTES:</p>
                    <p style="margin: 5px 0 0; color: #555; white-space: pre-wrap;">${inv.notes}</p>
                </div>` : ''}
                
                ${inv.dueDate ? `<p style="color: #ef4444; font-weight: bold;">* Due date: ${new Date(inv.dueDate).toLocaleDateString()}</p>` : ''}
                
                <p>You can view and pay your invoice from your dashboard.</p>
                <p style="margin-top: 30px;">Best regards,<br/><strong>NexIT Solutions Team</strong></p>
            </div>
        `

        const result = await sendMail(inv.user.email, subject, html)
        if (result.success) {
            await logBusinessActivity(sessionUser(session), {
                action: "INVOICE_EMAIL_SENT",
                summary: `Emailed invoice ${inv.invoiceNo} to ${inv.user.email}`,
                resourceType: "Invoice",
                resourceId: inv.id,
                req,
            })
            return NextResponse.json({ message: "Invoice sent successfully" })
        } else {
            console.error("Mail send failed:", result.error)
            const message = result.error instanceof Error ? result.error.message : String(result.error)
            return NextResponse.json({ error: message || "Failed to send email" }, { status: 500 })
        }

    } catch (error: any) {
        console.error("API error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
