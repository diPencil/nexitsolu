export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        await import("./lib/prisma-env-init");
    }
}
