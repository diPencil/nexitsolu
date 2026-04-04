import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * Production: if the database has no ADMIN users, create or promote the reserved default ADMIN.
 * This keeps fresh and imported deployments sign-in capable even when setup-admin was never called.
 *
 * Set SKIP_AUTO_ADMIN_BOOTSTRAP=1 to disable. Prefer BOOTSTRAP_ADMIN_PASSWORD in production.
 */
export async function ensureDefaultAdminIfNeeded(): Promise<void> {
    if (process.env["NODE_ENV"] !== "production") return;
    if (process.env["SKIP_AUTO_ADMIN_BOOTSTRAP"] === "1") return;

    try {
        const email =
            process.env["BOOTSTRAP_ADMIN_EMAIL"]?.trim() || "admin@nexitsolu.com";
        const username =
            process.env["BOOTSTRAP_ADMIN_USERNAME"]?.trim() || "admin";
        const plain =
            process.env["BOOTSTRAP_ADMIN_PASSWORD"]?.trim() || "Admin@123";

        const adminCount = await prisma.user.count({
            where: { role: "ADMIN" },
        });

        if (adminCount > 0) return;

        const hashedPassword = await bcrypt.hash(plain, 10);
        const existingReservedAccount = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingReservedAccount) {
            await prisma.user.update({
                where: { id: existingReservedAccount.id },
                data: {
                    email,
                    username,
                    password: hashedPassword,
                    name: "Main Admin",
                    role: "ADMIN",
                    status: "ACTIVE",
                },
            });
        } else {
            await prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                    name: "Main Admin",
                    role: "ADMIN",
                    status: "ACTIVE",
                },
            });
        }

        console.info(
            `[nexit] Default admin ensured. Email: ${email}, username: ${username}. Set BOOTSTRAP_ADMIN_PASSWORD and rotate after first login.`
        );
    } catch (e: unknown) {
        const code = (e as { code?: string })?.code;
        if (code === "P2002") {
            console.info("[nexit] Default admin already exists (race or duplicate).");
            return;
        }
        console.error("[nexit] ensureDefaultAdminIfNeeded:", e);
    }
}
