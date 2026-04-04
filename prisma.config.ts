import { defineConfig } from "prisma/config";

const url = process.env["DATABASE_URL"]?.trim() || "mysql://root:@localhost:3306/nexitsolu";

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url,
    },
});
