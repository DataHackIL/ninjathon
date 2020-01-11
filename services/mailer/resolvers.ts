import logger from './utilities/logger'

import { createTransport } from 'nodemailer'

const transporter = createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: 'contact@datahack.org.il',
        pass: '&KyTIS3EH&TJjOL3*WtIVPxl'
    }
})

const sendMail = (recipient, subject, message) => transporter.sendMail({
    from: '"DataHack " <contact@datahack.org.il>',
    to: recipient,
    subject: subject,
    html: message
})

export default {
    Mutation: {
        sendMail: async (parent, { input }) => {
            try {
                let info = await sendMail(input.recipient, input.subject, input.message)
                logger.info('Sent email ', info)
                return { response: info.response }
            } catch (error) {
                logger.error('Failed to send email ', error)
                return { errors: [error] }
            }
        }
    }
}