import { defineConfig } from "prisma/config";

/**
 * Prisma CLI reads this for migrate/db push. Relative `file:` URL works reliably
 * on Windows; absolute file URLs can fail with some schema-engine builds.
 */
const raw = process.env["DATABASE_URL"]?.trim();
const url =
    raw && raw !== "undefined" && raw !== "null"
        ? raw
        : "file:./prisma/dev.db";

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url,
    },
});
