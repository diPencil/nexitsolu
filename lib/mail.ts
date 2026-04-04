import nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"

const SMTP_CONFIGS = [
  { port: 465, secure: true, label: "465/SSL" },
  { port: 587, secure: false, label: "587/STARTTLS" },
]

function buildTransporter(port: number, secure: boolean): Transporter {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  })
}

function resolveFromAddress() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || "sales@nexitsolu.com"
}

export const sendMail = async (to: string, subject: string, html: string) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { success: false, error: new Error("SMTP configuration is incomplete.") }
  }

  const mailOptions = {
    from: `"NexIT Sales" <${resolveFromAddress()}>`,
    to,
    subject,
    html,
  }

  let lastError: unknown = null

  for (const cfg of SMTP_CONFIGS) {
    try {
      const transporter = buildTransporter(cfg.port, cfg.secure)
      const info = await transporter.sendMail(mailOptions)
      console.log(`Email sent via ${cfg.label}:`, info.messageId)
      return { success: true, info }
    } catch (error) {
      lastError = error
      console.warn(`SMTP ${cfg.label} failed:`, (error as Error)?.message)
    }
  }

  const e = lastError as Record<string, unknown>
  console.error("All SMTP attempts failed:", {
    message: (lastError as Error)?.message,
    code: e?.code,
    response: e?.response,
    command: e?.command,
  })
  return { success: false, error: lastError }
}
