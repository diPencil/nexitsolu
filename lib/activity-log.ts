import { prisma } from "@/lib/prisma";

export type ActivityPayload = {
    userId?: string | null;
    userEmail?: string | null;
    userRole?: string | null;
    username?: string | null;
    action: string;
    category: string;
    summary: string;
    path?: string | null;
    method?: string | null;
    resourceType?: string | null;
    resourceId?: string | null;
    metadata?: Record<string, unknown> | null;
    ip?: string | null;
    userAgent?: string | null;
};

/** Best-effort audit row; never throws to callers. */
export async function recordActivity(p: ActivityPayload): Promise<void> {
    try {
        await prisma.activityLog.create({
            data: {
                userId: p.userId ?? undefined,
                userEmail: p.userEmail ?? undefined,
                userRole: p.userRole ?? undefined,
                username: p.username ?? undefined,
                action: p.action.slice(0, 120),
                category: p.category.slice(0, 64),
                summary: p.summary.slice(0, 500),
                path: p.path ? p.path.slice(0, 500) : undefined,
                method: p.method ? p.method.slice(0, 16) : undefined,
                resourceType: p.resourceType
                    ? p.resourceType.slice(0, 64)
                    : undefined,
                resourceId: p.resourceId
                    ? p.resourceId.slice(0, 128)
                    : undefined,
                metadata: p.metadata ?? undefined,
                ip: p.ip ? p.ip.slice(0, 64) : undefined,
                userAgent: p.userAgent
                    ? p.userAgent.slice(0, 500)
                    : undefined,
            },
        });
    } catch (e) {
        console.error("[activity-log] recordActivity failed:", e);
    }
}
