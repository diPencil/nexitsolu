import nodemailer from "nodemailer"

function createTransporter() {
  const port = Number(process.env.SMTP_PORT) || 465
  const secure = process.env.SMTP_SECURE === "true" || port === 465

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
  })
}

function resolveFromAddress() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || "sales@nexitsolu.com"
}

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("SMTP configuration is incomplete. Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.")
    }

    const transporter = createTransporter()

    const info = await transporter.sendMail({
      from: `"NexIT Sales" <${resolveFromAddress()}>`,
      to,
      subject,
      html,
    })
    console.log("Email sent:", info.messageId)
    return { success: true, info }
  } catch (error) {
    const details = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          ...(error as any).code ? { code: (error as any).code } : {},
          ...(error as any).response ? { response: (error as any).response } : {},
          ...(error as any).command ? { command: (error as any).command } : {},
        }
      : error

    console.error("Error sending mail:", details)
    return { success: false, error }
  }
}
