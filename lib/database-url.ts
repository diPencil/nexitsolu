import path from "path";
import fs from "fs";
import { pathToFileURL } from "node:url";

/** When using `output: 'standalone'`, Node runs from `.next/standalone`; DB lives at repo root. */
export function projectRootForDb(): string {
    const cwd = process.cwd();
    const standaloneServer = path.join(cwd, "server.js");
    if (fs.existsSync(standaloneServer) && path.basename(cwd) === "standalone") {
        return path.resolve(cwd, "..", "..");
    }
    return cwd;
}

/**
 * Read DATABASE_URL without `process.env.DATABASE_URL` dot access so Next/Turbopack
 * does not statically replace it with `undefined` when .env was missing at compile time.
 */
function readEnvDatabaseUrl(): string | undefined {
    const v = process.env["DATABASE_URL"];
    if (v === undefined || v === "") return undefined;
    return v.trim();
}

/**
 * LibSQL must receive a real URL string. Resolves relative `file:./...` against project root.
 */
export function resolveDatabaseUrl(): string {
    const raw = readEnvDatabaseUrl();

    const invalid = !raw || raw === "undefined" || raw === "null";

    const root = projectRootForDb();
    const defaultDbFile = path.join(root, "prisma", "dev.db");

    if (invalid) {
        return pathToFileURL(defaultDbFile).href;
    }

    if (raw.startsWith("file:")) {
        const withoutScheme = raw.slice("file:".length);
        const isAbsolute =
            withoutScheme.startsWith("/") ||
            /^[a-zA-Z]:/.test(withoutScheme) ||
            withoutScheme.startsWith("//");
        if (!isAbsolute) {
            const rel = withoutScheme.replace(/^\.\//, "");
            const abs = path.resolve(root, rel);
            return pathToFileURL(abs).href;
        }
        return raw;
    }

    if (!raw.includes("://")) {
        const abs = path.resolve(root, raw.replace(/^\.\//, ""));
        return pathToFileURL(abs).href;
    }

    return raw;
}
