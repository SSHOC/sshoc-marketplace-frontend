import type { NextApiRequest, NextApiResponse } from 'next'
import * as nodemailer from 'nodemailer'

const SMTP_SERVER = process.env.SMTP_SERVER
const SMTP_PORT =
  process.env.SMTP_PORT !== undefined ? parseInt(process.env.SMTP_PORT, 10) : undefined
const SSHOC_CONTACT_EMAIL = process.env.SSHOC_CONTACT_EMAIL

export default async function contact(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (request.method !== 'POST') {
    response.status(405).end()
    return
  }

  if (SMTP_SERVER === undefined || SMTP_PORT === undefined || SSHOC_CONTACT_EMAIL === undefined) {
    return response.status(500).json({ message: 'Email service not configured.' })
  }

  const formSubmission = request.body

  if (formSubmission === null) {
    response.status(400).end()
    return
  }

  /** honeypot field */
  if (formSubmission.bot !== undefined) {
    response.status(400).end()
    return
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false,
  })

  try {
    const info = await transporter.sendMail({
      to: SSHOC_CONTACT_EMAIL,
      from: formSubmission.email,
      subject: formSubmission.subject,
      text: formSubmission.message,
    })

    // eslint-disable-next-line no-console
    console.log(`Contact message sent`, info)

    response.end()
    return
  } catch {
    response.status(500).end()
    return
  }
}
