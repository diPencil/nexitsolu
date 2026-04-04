import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PDFDocument, rgb, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";
const arabicReshaper = require("arabic-reshaper");

type ItemRow = {
    description?: string;
    quantity?: number;
    price?: number;
};

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN_X = 40;
const MIN_Y = 50;

function asItems(raw: unknown): ItemRow[] {
    if (!raw || !Array.isArray(raw)) return [];
    return raw as ItemRow[];
}

/** 
 * Arabic rendering helper: Reshapes letters and reverses string for RTL.
 */
function processArabic(text: string): string {
    if (!text) return "";
    // Check if contains Arabic characters
    if (!/[\u0600-\u06FF]/.test(text)) return text;
    
    try {
        const reshaped = arabicReshaper.convertArabic(text);
        return reshaped.split("").reverse().join("");
    } catch {
        return text;
    }
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

        console.log("Starting PDF generation for ID:", id);
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);
        let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
        
        const lang = req.nextUrl.searchParams.get("lang") || "en";
        const fontPath = path.join(process.cwd(), "public", "fonts", "Rubik-Regular.ttf");
        const fontBoldPath = path.join(process.cwd(), "public", "fonts", "Rubik-Bold.ttf");

        if (!fs.existsSync(fontPath)) {
            return NextResponse.json({ error: `Font file missing: ${fontPath}` }, { status: 500 });
        }

        const fontBytes = fs.readFileSync(fontPath);
        const font = await pdfDoc.embedFont(fontBytes);

        const fontBold = fs.existsSync(fontBoldPath)
            ? await pdfDoc.embedFont(fs.readFileSync(fontBoldPath))
            : font;
        
        const amiriPath = path.join(process.cwd(), "public", "fonts", "Amiri-Regular.ttf");
        let amiriFont: PDFFont | undefined;
        if (fs.existsSync(amiriPath)) {
            const amiriBytes = fs.readFileSync(amiriPath);
            amiriFont = await pdfDoc.embedFont(amiriBytes);
            console.log("Amiri fallback font embedded.");
        }
        
        console.log("Variable font embedded successfully.");

        let y = PAGE_H - 40;

        const newPage = () => {
            page = pdfDoc.addPage([PAGE_W, PAGE_H]);
            y = PAGE_H - 40;
        };

        const ensureY = (step: number) => {
            if (y - step < MIN_Y) newPage();
        };

        const hasArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

        const drawText = (text: string, x: number, size: number, f = font, color = rgb(0.1, 0.1, 0.1)) => {
            const isAr = hasArabic(String(text));
            const processed = processArabic(String(text));
            // Use Amiri for Arabic, provided font for English (usually Rubik)
            const activeFont = isAr && amiriFont ? amiriFont : f;
            page.drawText(processed, { x, y, size, font: activeFont, color });
        };

        const drawLine = (yPos: number) => {
            page.drawLine({
                start: { x: MARGIN_X, y: yPos },
                end: { x: PAGE_W - MARGIN_X, y: yPos },
                thickness: 0.5,
                color: rgb(0.85, 0.85, 0.85),
            });
        };

        // Header Section
        const publicDir = path.join(process.cwd(), "public");
        const logoPath = ["nexit-logo.png", "nexitlogo.png"]
            .map((f) => path.join(publicDir, f))
            .find((p) => fs.existsSync(p));

        if (logoPath) {
            try {
                const pngBytes = fs.readFileSync(logoPath);
                const png = await pdfDoc.embedPng(pngBytes);
                const imgH = 34;
                const scale = imgH / png.height;
                const imgW = png.width * scale;
                page.drawImage(png, { x: MARGIN_X, y: y - imgH, width: imgW, height: imgH });
                y -= imgH + 20;
            } catch {}
        }

        // Company Details (Left) vs Metadata (Right)
        const leftX = MARGIN_X;
        const rightX = PAGE_W - MARGIN_X - 160;
        const subSize = 9;

        // Title on Right - ALIGNED with rightX
        const titleY = y + 54; 
        const titleText = lang === 'ar' ? 'عرض سعر' : 'QUOTATION';
        page.drawText(processArabic(titleText), { x: rightX, y: titleY, size: 24, font: fontBold, color: rgb(0, 0, 0) });

        // Left side address updated
        drawText("Nexit Solutions Ltd - Engineering Excellence.", leftX, subSize + 1, fontBold);
        y -= 12;
        drawText("Operational Zone - Nationwide Coverage", leftX, subSize);
        y -= 12;
        drawText("Cairo, Hurghada & Global", leftX, subSize);
        y -= 12;
        drawText("Contact: sales@nexitsolu.com", leftX, subSize);

        // Right side metadata
        let metadataY = titleY - 32; 
        const drawMeta = (label: string, value: string, bold = false) => {
            const labelText = processArabic(label);
            const valText = processArabic(value);
            page.drawText(`${labelText} # ${valText}`, { x: rightX, y: metadataY, size: 9, font: bold ? fontBold : font, color: rgb(0.2, 0.2, 0.2) });
            metadataY -= 14;
        };

        drawMeta(lang === 'ar' ? 'عرض سعر' : 'Quotation', q.quotationNo, true);
        drawMeta(lang === 'ar' ? 'تاريخ الإصدار' : 'Created On', new Date(q.createdAt).toLocaleDateString("en-US", { month: 'short', day: '2-digit', year: 'numeric' }));
        drawMeta(lang === 'ar' ? 'الإجمالي التقديري' : 'Total Estimate', `${Number(q.amount).toFixed(2)} EGP`);
        if (q.validUntil) {
            drawMeta(lang === 'ar' ? 'صالح حتى' : 'Valid Until', new Date(q.validUntil).toLocaleDateString("en-US", { month: 'short', day: '2-digit', year: 'numeric' }));
        }

        // Status Badge
        const statusColor = q.status === "APPROVED" ? rgb(0.1, 0.6, 0.1) : q.status === "REJECTED" ? rgb(0.8, 0.1, 0.1) : rgb(0.6, 0.4, 0.1);
        page.drawText(processArabic(q.status || "PENDING"), { x: rightX, y: metadataY, size: 10, font: fontBold, color: statusColor });

        y = Math.min(y, metadataY) - 40;

        // BILLED TO
        drawText("QUOTED FOR", leftX, 10, fontBold);
        y -= 14;
        drawText(q.user?.name || "Target Prospect", leftX, 10);
        y -= 12;
        if (q.user?.governorate) {
            drawText(q.user.governorate, leftX, 9);
            y -= 12;
        }
        drawText(q.user?.email || "", leftX, 9, font, rgb(0.4, 0.4, 0.4));
        y -= 12;
        if (q.user?.phone) {
            drawText(q.user.phone, leftX, 9, font, rgb(0.4, 0.4, 0.4));
            y -= 12;
        }

        y -= 30;

        // Table Headers
        drawLine(y + 10);
        const col1 = leftX;
        const col2 = PAGE_W - MARGIN_X - 220; // Price
        const col3 = PAGE_W - MARGIN_X - 140; // Qty
        const col4 = PAGE_W - MARGIN_X - 60;  // Amount
        
        drawText("DESCRIPTION", col1, 8, fontBold, rgb(0.3, 0.3, 0.3));
        drawText("UNIT PRICE", col2, 8, fontBold, rgb(0.3, 0.3, 0.3));
        drawText("QTY", col3, 8, fontBold, rgb(0.3, 0.3, 0.3));
        drawText("TOTAL", col4, 8, fontBold, rgb(0.3, 0.3, 0.3));
        
        y -= 15;
        drawLine(y + 10);
        y -= 10;

        // Items
        const items = asItems(q.items);
        for (const row of items) {
            ensureY(40);
            const desc = String(row.description || "");
            const qty = Number(row.quantity) || 0;
            const price = Number(row.price) || 0;
            const total = qty * price;

            drawText(desc, col1, 10, fontBold);
            drawText(`${price.toFixed(2)}`, col2, 9);
            drawText(`${qty}`, col3, 9);
            drawText(`${total.toFixed(2)}`, col4, 10, fontBold);
            
            y -= 18;
            drawLine(y + 8);
            y -= 15;
        }

        if (items.length === 0) {
            drawText("No items proposed", col1, 9, font, rgb(0.5, 0.5, 0.5));
            y -= 20;
        }

        // Totals summary
        ensureY(100);
        y -= 10;
        const summaryX = PAGE_W - MARGIN_X - 160;
        const valX = PAGE_W - MARGIN_X - 40;

        const drawTotalRow = (label: string, value: string, isBold = false) => {
            page.drawText(processArabic(label), { x: summaryX, y, size: 9, font: isBold ? fontBold : font });
            const valText = processArabic(value);
            const valWidth = font.widthOfTextAtSize(valText, 9);
            page.drawText(valText, { x: valX - valWidth + 40, y, size: 9, font: isBold ? fontBold : font });
            y -= 16;
        };

        if (q.subtotal != null) {
            drawTotalRow(lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal', `${Number(q.subtotal).toFixed(2)} EGP`);
        }
        if (q.tax && Number(q.tax) > 0) {
            const taxAmt = (Number(q.subtotal || 0) * Number(q.tax)) / 100;
            drawTotalRow(lang === 'ar' ? `الضريبة (${q.tax}%)` : `VAT @ ${q.tax}%`, `${taxAmt.toFixed(2)} EGP`);
        }
        if (q.discount && Number(q.discount) > 0) {
            drawTotalRow(lang === 'ar' ? 'الخصم' : 'Discount', `-${Number(q.discount).toFixed(2)} EGP`);
        }

        y -= 5;
        drawLine(y + 10);
        y -= 5;
        drawTotalRow(lang === 'ar' ? 'الإجمالي النهائي' : 'Grand Total', `${Number(q.amount).toFixed(2)} EGP`, true);

        // Footer terms
        y = MIN_Y + 50;
        if (q.notes) {
            drawText("Terms & Conditions:", MARGIN_X, 8, fontBold);
            y -= 10;
            const notes = String(q.notes).slice(0, 300);
            drawText(notes, MARGIN_X, 8, font, rgb(0.4, 0.4, 0.4));
        }

        y = MIN_Y;
        drawText("This is a non-binding quotation valid until the expiration date.", MARGIN_X, 8, font, rgb(0.5, 0.5, 0.5));
        const dateStr = new Date().toLocaleString();
        const footerText = `Nexit - Generated on ${dateStr}`;
        const processedFooter = processArabic(footerText);
        const fw = font.widthOfTextAtSize(processedFooter, 7);
        page.drawText(processedFooter, { x: PAGE_W - MARGIN_X - fw, y, size: 7, font, color: rgb(0.6, 0.6, 0.6) });

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
        console.error("Quotation PDF generation error details:", e);
        return NextResponse.json({ error: "Failed to generate PDF: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
    }
}
