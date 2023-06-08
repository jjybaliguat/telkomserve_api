import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import errorhandler from './middleware/errorMiddleware.js';
import clientRoute from './routes/clientRoute.js';
import adminRoute from './routes/adminRoute.js';
import invoiceRoute from './routes/invoiceRoute.js';
import serviceableRoute from './routes/serviceableRoute.js';
import jobOrderRouter from './routes/jobOrderRoute.js';
import toCreateInvoiceRouter from './routes/toCreateInvoiceRoute.js';
import smsRouter from './routes/smsRoute.js';
// import mikrotikRoute from './routes/mikrotikRoute.js';
import connectDB from './db/connect.js';
import { corsOptions } from './config/corsOption.js';
// import pdf from 'html-pdf'
import { fileURLToPath } from 'url';
import { dirname } from 'path'
import pdfTemplate from './documents/index.js';
import emailTemplate from './documents/email.js';
import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { sendMultiple } from './utils/sendMultiple.js';
import http from 'http';
import { sendEmail } from './utils/sendEmail.js';
import Client from './model/clientModel.js';
import dayjs from 'dayjs';
import ToCreateInvoice from './model/toCreateInvoiceClient.js';
import axios from 'axios';
import schedule from 'node-schedule'
// import { MikroClient } from 'mikro-client'
// import { MikroClient } from 'mikro-client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cors(corsOptions))
// app.use(cors())

//Route Middleware
app.use("/api/v1/client", clientRoute)
app.use("/api/v1/admin", adminRoute)
app.use("/api/v1/invoice", invoiceRoute)
app.use("/api/v1/serviceable", serviceableRoute)
app.use("/api/v1/job-order", jobOrderRouter)
app.use("/api/v1/to-create-invoice", toCreateInvoiceRouter)
app.use("/api/v1/messages", smsRouter)
// app.use("/api/v1/mikrotik", mikrotikRoute)
// app.use("/api/v1/mikrotik", mikrotikRoute)
// app.use("/", (req, res) => {
//     res.send("Home page")
// })

//error middleware
app.use(errorhandler)
// NODEMAILER TRANSPORT FOR SENDING INVOICE VIA EMAIL

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

app.get('/', (req, res)=> {
    res.sendStatus(200)
})

// executes only At 05:00 on day-of-month 23.
cron.schedule('00 05 23 * *', async(req, res) => {
    const daysinMonth = dayjs().daysInMonth()
    if(daysinMonth == 28){
        const clients = await Client.find({dueDate: {$gt: 28}})
        if(clients){
            clients.map(async(client)=>{
                await ToCreateInvoice.create({clientId: client._id})
            })
        }

        const subject = `${clients.length} Clients Due beyond date 28`
        const email = 'justinejeraldbaliguat@gmail.com'
        const from = "Telkomserve VIRTUAL ASSITANT <telkomserve@zohomail.com>"
        const html = clients.length > 0 ? `
        <h3 style="text-align: center">Good Morning Telkomserve Team!</h3>
        <h3 style="text-align: center">Yo have ${clients.length}
        Clients Due beyond date 28 for this month. 
        </h3>
        <h3 style="text-align: center">Please create their invoices.</h3>
        <h3>Name of clients.</h3>
        <ol>
        ${
            clients.map((client)=>{
                return (
                    `<li>${client.name}</li>`
                )
            })
        }
        </ol>
        `
        :
        `
        <h3 style="text-align: center">Good Morning Telkomserve Team!</h3>
        <h3 style="text-align: center">Yo have No
        Clients Due beyond date 28 for this month. 
        </h3>
        <h3 style="text-align: center">Please check you invoices.</h3>
        `
        const send = await sendEmail(subject, html, email, from, '', '')
        if(send){
            res.status(200).json({
                msg: "Email sent"
            })
        }

    }
})
// executes only At 05:00 on day-of-month 24.
cron.schedule('00 05 24 * *', async(req, res) => {
    const daysinMonth = dayjs().daysInMonth()
    if(daysinMonth == 29){
        const clients = await Client.find({dueDate: {$gt: 29}})
        if(clients){
            clients.map(async(client)=>{
                await ToCreateInvoice.create({clientId: client._id})
            })
        }

        const subject = `${clients.length} Clients Due beyond date 29`
        const email = 'justinejeraldbaliguat@gmail.com'
        const from = "Telkomserve VIRTUAL ASSITANT <telkomserve@zohomail.com>"
        const html = clients.length > 0 ? `
        <h3 style="text-align: center">Good Morning Telkomserve Team!</h3>
        <h3 style="text-align: center">Yo have ${clients.length}
        Clients Due beyond date 29 for this month. 
        </h3>
        <h3 style="text-align: center">Please create their invoices.</h3>
        <h3>Name of clients.</h3>
        <ol>
        ${
            clients.map((client)=>{
                return (
                    `<li>${client.name}</li>`
                )
            })
        }
        </ol>
        `
        :
        `
        <h3 style="text-align: center">Good Morning Telkomserve Team!</h3>
        <h3 style="text-align: center">Yo have No
        Clients Due beyond date 29 for this month. 
        </h3>
        <h3 style="text-align: center">Please check you invoices.</h3>
        `
        const send = await sendEmail(subject, html, email, from, '', '')
        if(send){
            res.status(200).json({
                msg: "Email sent"
            })
        }

    }
})
// executes only At 05:00 on day-of-month 25.
cron.schedule('00 05 25 * *', async(req, res) => {
    const daysinMonth = dayjs().daysInMonth()
    if(daysinMonth == 30){
        const clients = await Client.find({dueDate: {$gt: 30}})
        if(clients){
            clients.map(async(client)=>{
                await ToCreateInvoice.create({clientId: client._id})
            })
        }

        const subject = `${clients.length} Clients Due beyond date 30`
        const email = 'justinejeraldbaliguat@gmail.com'
        const from = "Telkomserve VIRTUAL ASSITANT <telkomserve@zohomail.com>"
        const html = clients.length > 0 ? `
        <h3 style="text-align: center">Good Morning Telkomserve Team!</h3>
        <h3 style="text-align: center">Yo have ${clients.length}
        Clients Due beyond date 30 for this month. 
        </h3>
        <h3 style="text-align: center">Please create their invoices.</h3>
        <h3>Name of clients.</h3>
        <ol>
        ${
            clients.map((client)=>{
                return (
                    `<li>${client.name}</li>`
                )
            })
        }
        </ol>
        `
        :
        `
        <h3 style="text-align: center">Good Morning Telkomserve Team!</h3>
        <h3 style="text-align: center">Yo have No
        Clients Due beyond date 30 for this month. 
        </h3>
        <h3 style="text-align: center">Please check you invoices.</h3>
        `
        const send = await sendEmail(subject, html, email, from, '', '')
        if(send){
            res.status(200).json({
                msg: "Email sent"
            })
        }

    }
})

// executes every day at 5 am
cron.schedule('00 05 * * *', async(req, res) => {
    let day = 0
    const today = dayjs().date()
    const daysinMonth = dayjs().daysInMonth()
    const lastDay_lastMonth = dayjs().date(0).date()
    const ans = today + 5
    if(ans > daysinMonth){
        day = ans - daysinMonth
    }else if(ans <= 0){
      day = ans + lastDay_lastMonth
    }
    else{
      day = ans
    }

    const clients = await Client.find({dueDate: day})

    const ids = []
    const names = []
    if(clients){
        clients.map((client)=>{
            ids.push(client._id)
            names.push(client.name)
        })
    }

    if(ids.length){
        ids.map(async (client)=> {
            await ToCreateInvoice.create({clientId: client._id})
        })
    }
    const subject = `${clients.length} Clients Due in 5 Days`
    const email = 'justinejeraldbaliguat@gmail.com'
    const from = "Telkomserve VIRTUAL ASSITANT <telkomserve@zohomail.com>"
    const html = clients.length > 0 ? `
    <h3 style="text-align: center">Good Morning Telkomserve Team!</h3>
    <h3 style="text-align: center">Yo have ${clients.length}
    clients due in 5 days. 
    </h3>
    <h3 style="text-align: center">Please create their invoices.</h3>
    `
    :
    `
    <h3 style="text-align: center">Good Morning Telkomserve Team!</h3>
    <h3 style="text-align: center">Yo have No
    clients due in 5 days. 
    </h3>
    <h3 style="text-align: center">Please check you invoices.</h3>
    `
    const send = await sendEmail(subject, html, email, from, '', '')
    if(send){
        res.status(200).json({
            msg: "Email sent"
        })
    }
})

var options = { format: 'A4' };

app.post('/api/v1/send-multiple', async(req,res) => {
    const {recipients, subject, message} = req.body

    const from = "Telkomserve <telkomserve@zohomail.com>"
    const replyTo = process.env.EMAIL_USER

    try {
        await sendMultiple(subject, message, recipients, from, replyTo)
        res.status(200).json({
            success: true,
            msg: 'Email sent Successfully'
        })
    } catch (error) {
        res.status(400)
        throw new Error(error)
    }
})

app.post('/api/v1/schedule-send', async(req, res) => {
    const {scheduledDate, email, company} = req.body
    const newDate = new Date(scheduledDate)
    console.log(newDate)
    schedule.scheduleJob('2023-05-20T14:24:00.000Z', () => {
        console.log("ok")
        transporter.sendMail({
        from: "Telkomserve <telkomserve@zohomail.com>", // sender address
        // to: `${email}`, // list of receivers
        to: email, // list of receivers
        replyTo: `${company.email}`,
        subject: `Invoice from ${company.businessName ? company.businessName : company.name}`, // Subject line
        text: `Invoice from ${company.businessName ? company.businessName : company.name }`, // plain text body
        html: emailTemplate(req.body), // html body
        // attachments: [{
        //     filename: 'invoice.pdf',
        //     path: `${__dirname}/invoice.pdf`
        // }]
        });
    })

    res.status(200).json({
        msg: 'Email scheduled'
    })
})

app.post('/api/v1/send-pdf', async(req, res)=>{
    const {email, company} = req.body

    try {
        const send = await transporter.sendMail({
            from: "Telkomserve <telkomserve@zohomail.com>", // sender address
            // to: `${email}`, // list of receivers
            to: email, // list of receivers
            replyTo: `${company.email}`,
            subject: `Invoice from ${company.businessName ? company.businessName : company.name}`, // Subject line
            text: `Invoice from ${company.businessName ? company.businessName : company.name }`, // plain text body
            html: emailTemplate(req.body), // html body
            // attachments: [{
            //     filename: 'invoice.pdf',
            //     path: `${__dirname}/invoice.pdf`
            // }]
        });

        if(send){
            res.status(200).json({
                msg: 'Email sent Successfully'
            })
        }

    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }


})

app.post('/api/v1/create-pdf', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote",
            ],
            executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath()
        })
        const page = await browser.newPage()

        await  page.setContent(pdfTemplate(req.body))
        await page.emulateMediaType('screen')
        await page.pdf({
            path: `${__dirname}/invoice.pdf`,
            format: 'A4',
            printBackground: true
        })
        await browser.close()

        res.status(200).json({
            msg: 'invoice downloaded successfully'
        })
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
})

app.post('/api/v1/client/send-message', async(req, res) => {
    const {name, email, subject, message} = req.body

    if(!name || !email || !subject || !message){
        res.status(400)
        throw new Error("Please fill all required fields.")
    }
    try {
        const subject = `Message from ${name} <${email}>`
        const from = `${name} <telkomserve@zohomail.com>`
        const recipients = 'justinejeraldbaliguat@gmail.com'
        // const recipients = ['justinejeraldbaliguat@gmail.com']
        const send = await sendEmail(subject, '', recipients, from, '', message)
        res.status(200).json({
            msg: 'Message sent Successfully'
        })
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
})

app.get('/api/v1/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/invoice.pdf`)
})

const PORT = process.env.PORT || 5000
const URL = process.env.MONGO_URI

mongoose.set('strictQuery', false)

// mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true})
//     .then(app.listen(PORT, () => {
//         console.log(`Server is Running on port ${PORT}`);
//     })).catch((error) => console.log(error))

const start = async () => {
    try {
        await connectDB(URL)
        app.listen(PORT, () => {
            console.log(`Server is Running on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()
