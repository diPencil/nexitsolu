import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function resolveFromAddress() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || "sales@nexitsolu.com"
}

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("SMTP configuration is incomplete. Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.")
    }

    const info = await transporter.sendMail({
      from: `"NexIT Sales" <${resolveFromAddress()}>`,
      to,
      subject,
      html,
    })
    console.log("Email sent:", info.messageId)
    return { success: true, info }
  } catch (error) {
    console.error("Error sending mail:", error)
    return { success: false, error }
  }
}
