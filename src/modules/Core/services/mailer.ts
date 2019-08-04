import nodemailer from 'nodemailer'
import { logger } from '~/modules/Core/services/logger'

export interface IMailerParams {
  from: string
  to: string
  subject: string
  html: string
}

export const sendEmail = async (params: IMailerParams) => {
  const account = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    // true for 465, false for other ports
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  })

  const mailOptions = {
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  }

  const info = await transporter.sendMail(mailOptions)

  logger.info(`Message sent: ${info.messageId}`)
  logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
}
