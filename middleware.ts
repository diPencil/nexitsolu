import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const MUTABLE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** Avoid duplicate rows: these routes call logBusinessActivity with human-readable text. */
function shouldSkipGenericApiLog(method: string, pathname: string): boolean {
    const path = pathname.replace(/\/+$/, "") || "/";
    const m = method.toUpperCase();

    if (m === "POST" && path === "/api/register") return true;
    if (m === "POST" && path === "/api/corporate/register") return true;
    if (m === "POST" && path === "/api/products") return true;
    if (
        (m === "PUT" || m === "DELETE") &&
        /^\/api\/products\/[^/]+$/.test(path)
    ) {
        return true;
    }
    if (m === "POST" && path === "/api/messages") return true;
    if (m === "POST" && path === "/api/contact") return true;
    if (m === "POST" && path === "/api/orders") return true;
    if (
        path.startsWith("/api/admin/invoices") &&
        ["POST", "PATCH", "DELETE"].includes(m)
    ) {
        return true;
    }
    if (
        path.startsWith("/api/admin/purchases") &&
        ["POST", "DELETE"].includes(m)
    ) {
        return true;
    }
    if (m === "POST" && path.startsWith("/api/admin/quotations/send")) {
        return true;
    }
    if (
        (path === "/api/admin/quotations" ||
            path.startsWith("/api/admin/quotations?")) &&
        ["POST", "PATCH", "DELETE"].includes(m)
    ) {
        return true;
    }
    if (
        path.startsWith("/api/admin/suppliers") &&
        ["POST", "PUT", "DELETE"].includes(m)
    ) {
        return true;
    }
    if (
        m === "POST" &&
        /^\/api\/admin\/messages\/[^/]+$/.test(path)
    ) {
        return true;
    }
    if (
        m === "PATCH" &&
        /^\/api\/admin\/messages\/[^/]+\/close$/.test(path)
    ) {
        return true;
    }
    return false;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const method = request.method;

    const logSecret = process.env["ACTIVITY_LOG_INTERNAL_SECRET"];
    const authSecret = process.env["NEXTAUTH_SECRET"];

    if (!logSecret || !authSecret) {
        return NextResponse.next();
    }

    if (!pathname.startsWith("/api/")) {
        return NextResponse.next();
    }
    if (pathname.startsWith("/api/auth/")) {
        return NextResponse.next();
    }
    if (pathname.startsWith("/api/internal/")) {
        return NextResponse.next();
    }
    if (!MUTABLE.has(method)) {
        return NextResponse.next();
    }

    if (shouldSkipGenericApiLog(method, pathname)) {
        return NextResponse.next();
    }

    let token: Record<string, unknown> | null = null;
    try {
        const t = await getToken({ req: request, secret: authSecret });
        token = t as Record<string, unknown> | null;
    } catch {
        token = null;
    }

    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "";
    const ua = request.headers.get("user-agent") || "";

    const payload = {
        userId: (token?.sub as string) ?? null,
        userEmail: (token?.email as string) ?? null,
        userRole: (token?.role as string) ?? null,
        username: (token?.username as string) ?? null,
        action: `API_${method}`,
        category: "api",
        summary: `${method} ${pathname}`.slice(0, 500),
        path: pathname,
        method,
        metadata: { source: "middleware" },
        ip: ip || null,
        userAgent: ua || null,
    };

    const logUrl = new URL("/api/internal/activity", request.nextUrl.origin);
    fetch(logUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-internal-log-secret": logSecret,
        },
        body: JSON.stringify(payload),
    }).catch(() => {});

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};
