import { execFileSync, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Hostinger / shared hosting: env vars are often missing during `npm run build`,
 * so `prisma db push` in the build script never touches the real DB file.
 * Sync the SQLite schema once when the Node server starts (idempotent, fast if already in sync).
 */
function syncSqliteSchemaIfNeeded() {
    const url = process.env["DATABASE_URL"]?.trim() ?? "";
    if (process.env["NODE_ENV"] !== "production") return;
    if (!url.startsWith("file:")) return;
    if (process.env["SKIP_RUNTIME_PRISMA_DB_PUSH"] === "1") return;

    const cwd = process.cwd();
    const prismaCli = path.join(cwd, "node_modules", "prisma", "build", "index.js");

    try {
        if (existsSync(prismaCli)) {
            execFileSync(process.execPath, [prismaCli, "db", "push"], {
                stdio: "pipe",
                env: process.env,
                cwd,
            });
        } else {
            execSync("npx prisma db push", { stdio: "pipe", env: process.env, cwd });
        }
        console.info("[nexit] Prisma: schema synced (runtime db push).");
    } catch (e) {
        console.error("[nexit] Prisma: runtime db push failed — check DATABASE_URL and prisma/ on the server.", e);
    }
}

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        await import("./lib/prisma-env-init");
        syncSqliteSchemaIfNeeded();
        const { ensureDefaultAdminIfNeeded } = await import(
            "./lib/ensure-default-admin"
        );
        await ensureDefaultAdminIfNeeded();
    }
}
