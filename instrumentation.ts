export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        await import("./lib/prisma-env-init");
        const { syncSqliteSchemaIfNeeded } = await import(
            "./lib/instrumentation-sqlite-sync"
        );
        syncSqliteSchemaIfNeeded();
        const { ensureDefaultAdminIfNeeded } = await import(
            "./lib/ensure-default-admin"
        );
        await ensureDefaultAdminIfNeeded();
    }
}
