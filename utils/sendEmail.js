import nodemailer from 'nodemailer'

export const sendEmail = async (subject, message, recipients, send_from, reply_to, text) => {
    //create email transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        },
        tls:{
            rejectUnauthorized:false
        }
    })

    //Option for sending email
    const options = {
        from: send_from,
        to: recipients,
        replyTo: reply_to,
        text: text,
        subject: subject,
        html: message
    }

    //send email
    transporter.sendMail(options)
}