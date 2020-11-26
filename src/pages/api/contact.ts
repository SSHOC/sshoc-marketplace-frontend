import type { NextApiRequest, NextApiResponse } from 'next'
import * as nodemailer from 'nodemailer'

const SMTP_SERVER = process.env.SMTP_SERVER
const SMTP_PORT =
  process.env.SMTP_PORT !== undefined
    ? parseInt(process.env.SMTP_PORT, 10)
    : undefined
const SSHOC_CONTACT_EMAIL = process.env.SSHOC_CONTACT_EMAIL

export default async function contact(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (request.method !== 'POST') {
    return response.status(405).end()
  }

  if (
    SMTP_SERVER === undefined ||
    SMTP_PORT === undefined ||
    SSHOC_CONTACT_EMAIL === undefined
  ) {
    return response
      .status(500)
      .json({ message: 'Email service not configured.' })
  }

  const formSubmission = request.body

  if (formSubmission === null) {
    return response.status(400).end()
  }

  /** honeypot field */
  if (formSubmission.bot !== '') {
    response.status(400).end()
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

    console.log(`Contact message sent`, info)

    return response.end()
  } catch {
    return response.status(500).end()
  }
}
