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

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"NexIT Sales" <${process.env.SMTP_FROM}>`,
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
