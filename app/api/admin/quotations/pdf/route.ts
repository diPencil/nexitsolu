import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

type ItemRow = {
    description?: string;
    quantity?: number;
    price?: number;
};

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN_X = 50;
const MIN_Y = 56;

function asItems(raw: unknown): ItemRow[] {
    if (!raw || !Array.isArray(raw)) return [];
    return raw as ItemRow[];
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const q = await prisma.quotation.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!q) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        /** Baseline Y (PDF origin bottom-left; larger Y = higher on page). */
        let y = PAGE_H - 52;

        const newPage = () => {
            page = pdfDoc.addPage([PAGE_W, PAGE_H]);
            y = PAGE_H - 52;
        };

        const ensureY = (step: number) => {
            if (y - step < MIN_Y) newPage();
        };

        const publicDir = path.join(process.cwd(), "public");
        const logoPath = ["nexit-logo.png", "nexitlogo.png"]
            .map((f) => path.join(publicDir, f))
            .find((p) => fs.existsSync(p));

        if (logoPath) {
            try {
                const pngBytes = fs.readFileSync(logoPath);
                const png = await pdfDoc.embedPng(pngBytes);
                const imgH = 38;
                const scale = imgH / png.height;
                const imgW = png.width * scale;
                ensureY(imgH + 16);
                page.drawImage(png, {
                    x: MARGIN_X,
                    y: y - imgH,
                    width: imgW,
                    height: imgH,
                });
                y = y - imgH - 16;
            } catch {
                /* optional logo */
            }
        }

        const drawBold = (text: string, size: number, color = rgb(0, 0, 0)) => {
            ensureY(size + 10);
            page.drawText(text, {
                x: MARGIN_X,
                y,
                size,
                font: fontBold,
                color,
            });
            y -= size + 10;
        };

        const draw = (
            text: string,
            size: number,
            color = rgb(0.15, 0.15, 0.15)
        ) => {
            ensureY(size + 8);
            page.drawText(text, {
                x: MARGIN_X,
                y,
                size,
                font,
                color,
            });
            y -= size + 6;
        };

        drawBold("QUOTATION", 18, rgb(0, 0, 0));
        draw(`#${q.quotationNo}`, 11, rgb(0, 0.25, 0.95));
        y -= 6;

        drawBold("From", 9, rgb(0.35, 0.35, 0.35));
        draw("NexIT Solutions", 11);
        draw("sales@nexitsolu.com", 10, rgb(0.35, 0.35, 0.35));
        y -= 8;

        drawBold("Bill to", 9, rgb(0.35, 0.35, 0.35));
        const clientName = q.user?.name || "Client";
        const clientEmail = q.user?.email || "";
        draw(clientName, 11);
        if (clientEmail) draw(clientEmail, 10, rgb(0.35, 0.35, 0.35));
        y -= 8;

        draw(
            `Issue date: ${new Date(q.createdAt).toLocaleDateString()}`,
            10,
            rgb(0.35, 0.35, 0.35)
        );
        if (q.validUntil) {
            draw(
                `Valid until: ${new Date(q.validUntil).toLocaleDateString()}`,
                10,
                rgb(0.75, 0.2, 0.2)
            );
        }
        y -= 10;

        drawBold("Line items", 10, rgb(0.35, 0.35, 0.35));
        const items = asItems(q.items);
        for (const row of items) {
            const desc = String(row.description || "").slice(0, 220);
            const qty = Number(row.quantity) || 0;
            const price = Number(row.price) || 0;
            const lineTotal = qty * price;
            draw(
                `• ${desc}  |  Qty ${qty} × ${price.toFixed(2)} = ${lineTotal.toFixed(2)} EGP`,
                9
            );
        }
        if (items.length === 0) {
            draw("(No line items)", 9, rgb(0.5, 0.5, 0.5));
        }
        y -= 8;

        if (q.subtotal != null) {
            draw(`Subtotal: ${Number(q.subtotal).toFixed(2)} EGP`, 10);
        }
        if (q.discount && Number(q.discount) > 0) {
            draw(
                `Discount: -${Number(q.discount).toFixed(2)} EGP`,
                10,
                rgb(0.1, 0.55, 0.35)
            );
        }
        if (q.tax && Number(q.tax) > 0 && q.subtotal != null) {
            const taxAmt = (Number(q.subtotal) * Number(q.tax)) / 100;
            draw(
                `Tax (${Number(q.tax)}%): +${taxAmt.toFixed(2)} EGP`,
                10,
                rgb(0.65, 0.45, 0.1)
            );
        }
        y -= 6;
        drawBold(
            `Total: ${Number(q.amount).toFixed(2)} EGP`,
            13,
            rgb(0, 0.25, 0.95)
        );
        draw(`Status: ${q.status}`, 9, rgb(0.4, 0.4, 0.4));

        if (q.notes) {
            y -= 10;
            drawBold("Notes", 9, rgb(0.35, 0.35, 0.35));
            const notes = String(q.notes).slice(0, 500);
            const chunk = 85;
            for (let i = 0; i < notes.length; i += chunk) {
                draw(notes.slice(i, i + chunk), 9, rgb(0.3, 0.3, 0.3));
            }
        }

        const pdfBytes = await pdfDoc.save();
        const filename = `Quotation-${q.quotationNo.replace(/[^\w.-]+/g, "_")}.pdf`;

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (e) {
        console.error("Quotation PDF error:", e);
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
