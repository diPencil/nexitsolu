import { prisma } from "@/lib/prisma"

export async function notifyAdmins(titleAr: string, titleEn: string, messageAr: string, messageEn: string, type: string) {
    try {
        const admins = await prisma.user.findMany({ where: { role: "ADMIN" } })
        const notifications = admins.map(admin => ({
            userId: admin.id,
            title: `${titleAr}|${titleEn}`,
            message: `${messageAr}|${messageEn}`,
            type
        }))
        if (notifications.length > 0) {
            await prisma.notification.createMany({ data: notifications })
        }
    } catch (error) {
        console.error("Failed to notify admins", error)
    }
}
