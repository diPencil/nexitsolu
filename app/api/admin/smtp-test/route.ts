import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import nodemailer from "nodemailer"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT) || 465
    const secure = process.env.SMTP_SECURE === "true" || port === 465
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    // Return masked config so we can see what's actually being loaded
    const configInfo = {
      host,
      port,
      secure,
      user,
      passLength: pass?.length ?? 0,
      passFirst2: pass ? pass.substring(0, 2) : null,
      passLast2: pass ? pass.substring(pass.length - 2) : null,
    }

    // Try port 465 first, then 587 as fallback
    const configs = [
      { port: 465, secure: true, label: "465/SSL" },
      { port: 587, secure: false, label: "587/STARTTLS" },
    ]

    const results: Record<string, unknown> = { configLoaded: configInfo, tests: {} }

    for (const cfg of configs) {
      try {
        const t = nodemailer.createTransport({
          host,
          port: cfg.port,
          secure: cfg.secure,
          auth: { user, pass },
          tls: { rejectUnauthorized: false },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000,
        })
        await t.verify()
        ;(results.tests as Record<string, unknown>)[cfg.label] = "SUCCESS"
        results.workingPort = cfg.port
        results.workingSecure = cfg.secure
        break
      } catch (err: unknown) {
        ;(results.tests as Record<string, unknown>)[cfg.label] = {
          error: err instanceof Error ? err.message : String(err),
          code: (err as Record<string, unknown>)?.code,
          response: (err as Record<string, unknown>)?.response,
        }
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
