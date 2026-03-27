import { prisma } from "@/lib/prisma"
import { STATIC_SUBSCRIPTION_SERVICE_OPTIONS } from "@/lib/subscription-services"

/** Inserts default NexIT service rows when the table is empty (first deploy / new DB). */
export async function ensureSubscriptionServicesSeeded(): Promise<void> {
    const count = await prisma.subscriptionService.count()
    if (count > 0) return
    await prisma.subscriptionService.createMany({
        data: STATIC_SUBSCRIPTION_SERVICE_OPTIONS.map((o, i) => ({
            key: o.key,
            nameEn: o.labelEn,
            nameAr: o.labelAr,
            sortOrder: i,
            active: true,
        })),
    })
}
