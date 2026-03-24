import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * Production: if the database has no users at all, create a default ADMIN once.
 * Avoids "Login failed" on fresh SQLite / Hostinger deploys when setup-admin was never called.
 * Skipped if any user row exists (so we never overwrite a real site).
 *
 * Set SKIP_AUTO_ADMIN_BOOTSTRAP=1 to disable. Prefer BOOTSTRAP_ADMIN_PASSWORD in production.
 */
export async function ensureDefaultAdminIfNeeded(): Promise<void> {
    if (process.env["NODE_ENV"] !== "production") return;
    if (process.env["SKIP_AUTO_ADMIN_BOOTSTRAP"] === "1") return;

    try {
        const totalUsers = await prisma.user.count();
        if (totalUsers > 0) return;

        const email =
            process.env["BOOTSTRAP_ADMIN_EMAIL"]?.trim() || "admin@nexitsolu.com";
        const username =
            process.env["BOOTSTRAP_ADMIN_USERNAME"]?.trim() || "admin";
        const plain =
            process.env["BOOTSTRAP_ADMIN_PASSWORD"]?.trim() || "Admin@123";

        const hashedPassword = await bcrypt.hash(plain, 10);

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

        console.info(
            `[nexit] Default admin created (empty database). Email: ${email}, username: ${username}. Set BOOTSTRAP_ADMIN_PASSWORD and rotate after first login.`
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
