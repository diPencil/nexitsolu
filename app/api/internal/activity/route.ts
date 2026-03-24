import { NextResponse } from "next/server";
import { recordActivity } from "@/lib/activity-log";
import type { ActivityPayload } from "@/lib/activity-log";

/**
 * Ingest logs from Edge middleware (cannot use Prisma there).
 * Protected by ACTIVITY_LOG_INTERNAL_SECRET — set in production.
 */
export async function POST(req: Request) {
    const secret = process.env["ACTIVITY_LOG_INTERNAL_SECRET"];
    if (!secret) {
        return NextResponse.json(
            { error: "Logging not configured" },
            { status: 503 }
        );
    }
    if (req.headers.get("x-internal-log-secret") !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = (await req.json()) as ActivityPayload;
        if (!body?.action || !body?.category || !body?.summary) {
            return NextResponse.json(
                { error: "Invalid payload" },
                { status: 400 }
            );
        }
        await recordActivity(body);
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
}
