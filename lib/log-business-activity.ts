import { recordActivity } from "@/lib/activity-log";

type Actor = {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
    username?: string | null;
};

/** Client IP / path from the incoming Request (proxies: x-forwarded-for, x-real-ip). */
export function requestClientMeta(req: Request): {
    path: string;
    method: string;
    ip: string | null;
    userAgent: string | null;
} {
    let path = "";
    try {
        path = new URL(req.url).pathname;
    } catch {
        path = "";
    }
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        null;
    return {
        path,
        method: req.method,
        ip,
        userAgent: req.headers.get("user-agent"),
    };
}

/** Rich audit row for business events (shown in admin Activity log). */
export async function logBusinessActivity(
    actor: Actor | null | undefined,
    opts: {
        action: string;
        summary: string;
        resourceType?: string;
        resourceId?: string;
        metadata?: Record<string, unknown>;
        /** When set, fills Path / IP / User-Agent columns like middleware `api` logs. */
        req?: Request | null;
    }
): Promise<void> {
    const net = opts.req ? requestClientMeta(opts.req) : null;
    await recordActivity({
        userId: actor?.id ?? null,
        userEmail: actor?.email ?? null,
        userRole: actor?.role ? String(actor.role) : null,
        username: actor?.username ?? null,
        action: opts.action.slice(0, 120),
        category: "business",
        summary: opts.summary.slice(0, 500),
        resourceType: opts.resourceType,
        resourceId: opts.resourceId,
        metadata: opts.metadata,
        path: net?.path || null,
        method: net?.method || null,
        ip: net?.ip ?? null,
        userAgent: net?.userAgent ?? null,
    });
}

export function sessionUser(session: {
    user?: Actor;
}): Actor | null {
    return session?.user ?? null;
}
