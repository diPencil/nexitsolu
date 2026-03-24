import { recordActivity } from "@/lib/activity-log";

type Actor = {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
    username?: string | null;
};

/** Rich audit row for business events (shown in admin Activity log). */
export async function logBusinessActivity(
    actor: Actor | null | undefined,
    opts: {
        action: string;
        summary: string;
        resourceType?: string;
        resourceId?: string;
        metadata?: Record<string, unknown>;
    }
): Promise<void> {
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
    });
}

export function sessionUser(session: {
    user?: Actor;
}): Actor | null {
    return session?.user ?? null;
}
