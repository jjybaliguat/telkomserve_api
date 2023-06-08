import asyncHanndler from 'express-async-handler'
import Client from '../model/clientModel.js'
import jwt from 'jsonwebtoken'
import Admin from '../model/adminModel.js'
import History from '../model/historyModel.js'
import  { storage } from '../utils/firebase.js'
import verificationTemplate from '../documents/verification.js'
import nodemailer from 'nodemailer'
import {
    ref,
    uploadBytes,
    getDownloadURL
  } from "firebase/storage";
import { v4 } from "uuid";
import { sendEmail } from '../utils/sendEmail.js'
import Otp from '../model/otpModel.js'
import { sendMultiple } from '../utils/sendMultiple.js'
import InvoiceModel from '../model/invoiceModel.js'
import generateSOAPdf from '../utils/generatepdf.js'

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

function getRandom(length) {
    return `${Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1))}`;
}

// function getRandom(length) {
//     return `01${Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1))}`;
// }

export const registerClient = asyncHanndler( async (req, res) => {

    const {name, email, phone, address, internetPlan} = req.body

        if (!name || !email || !phone || !address || !internetPlan) {
            res.status(400)
            throw new Error("Please fill all required fields!")
        }
        //check if email already exist
        const clientExist = await Client.findOne({email})
        if(clientExist){
            res.status(400)
            throw new Error("Email already exist!")
        }

        //Create  new Client
        const password = "123456789"

        const client = await Client.create(req.body)

        if(client){
            const {connectionStatus, email, verificationCode} = client
            
            if(connectionStatus === "activated"){
                await History.create({
                    action: `client ${name} has beed added`,
                })
            }else if(connectionStatus === "pending"){
                await History.create({
                    action: `applicant ${name} has beed registered`,
                })
            }
            if(verificationCode !== "0"){
                const message = verificationTemplate({email, verificationCode})
                const subject = `RDNAKS VERIFICATION CODE`
                const send_to = email
                const text = "Verify your email address"
                const send_from = `RDNAKS <rdnaksnds@rdnaksnds.com>`

                try {
                    await sendEmail(subject, message, send_to, send_from, text)
                } catch (error) {
                    throw new Error(error)
                }
            }
            res.status(201).json(client)
        }else{
            res.status(400)
            throw new Error("Invalid Client Data")
        }
})

export const resendCode = asyncHanndler(async(req,res) => {
    const {email} = req.body
    const verificationCode = getRandom(5)

    const client = await Client.findOne({email})

    if(client){
        client.verificationCode = verificationCode
        client.save()
        const message = verificationTemplate({email, verificationCode})
        const subject = `TELKOMSERVE VERIFICATION CODE`
        const send_to = email
        const text = "Verify your email address"
        const send_from = `TELKOMSERVE <telkomserve@zohomail.com>`
    
        try {
            await sendEmail(subject, message, send_to, send_from, text)
            res.status(200).json({
                msg: "verification code sent"
            })
        } catch (error) {
            throw new Error(error)
        }
    }else{
        throw new Error("Failed sending verification code")
    }
})

export const verifyCode = asyncHanndler(async(req,res)=> {
    const {code, email} = req.body

    const client = await Client.findOne({email})
    if(client){
        const {verificationCode} = client
        if(verificationCode === code){
            client.verificationCode = "0"
            client.isVerified = true
            client.save()
            res.status(200).json({
                msg: "Email verified successfully"
            })
        }else{
            res.status(400).json({
                msg:"Invalid code!"
            })
        }
    }
})

export const checkEmail = asyncHanndler(async(req,res)=> {
    const {email} = req.body

    const client = await Client.findOne({email})
    if(client){
        return res.json({
            exist: true
        })
    }else{
        return res.json({
            exist: false
        })
    }
})

export const getAllClient = asyncHanndler( async (req, res) => {
    const clients = await Client.find({connectionStatus: "activated"})
    res.status(200).json({
        clients
    })
})
export const getAllApplicants = asyncHanndler( async (req, res) => {
    const applicants = await Client.find({connectionStatus: "pending"})
    res.status(200).json({
        applicants
    })
})

export const getSingleClient = asyncHanndler( async (req, res) => {
    const {id:clientId} = req.params
    const client = await Client.findOne({_id:clientId})
    if(!client) {
        res.status(404)
        throw new Error(`No client with an id of ${clientId}`)
    }
    res.status(200).json({
        client
    })
})

export const updateClient = asyncHanndler( async (req, res) => {
    const {id:clientId} = req.params



    const client = await Client.findById({_id:clientId})

    if(!client) {
        res.status(404)
        throw new Error(`No client with an id of ${clientId}`)
    }

    client.name = req.body.data.name || client.name
    client.accountNumber = req.body.data.accountNumber || client.accountNumber
    client.phone = req.body.data.phone || client.phone
    client.email = req.body.data.email || client.email
    client.address = req.body.data.address || client.address
    client.connectionStatus = req.body.data.connectionStatus || client.connectionStatus
    client.dueDate = req.body.data.dueDate || client.dueDate
    client.idPic = req.body.data.idPic || client.idPic
    client.photo = req.body.data.photo || client.photo 
    client.housePic = req.body.data.homePic || client.housePic
    client.installationBalance = req.body.data.installationBalance || client.installationBalance
    client.installationDate = req.body.data.installationDate || client.installationDate
    client.internetPlan = req.body.data.internetPlan || client.internetPlan
    
    client.save()

    res.status(200).json(client)
})

export const deleteClient = asyncHanndler( async (req, res) => {
    const {id:clientId} = req.params

    const client = await Client.findByIdAndDelete({_id:clientId})

    if(!client){
        res.status(404)
        throw new Error(`No client with an id of ${clientId}`)
    }
    res.status(200).json({
        msg: "Client deleted Successfully"
    })
})

export const verifyAccountNumber = asyncHanndler(async(req, res)=>{
    const {accountNumber} = req.body

    const client = await Client.findOne({accountNumber: accountNumber})
    if(!client){
        res.status(400)
        throw new Error('Please enter a valid account number')
    }
    res.status(200).json({
        exist: true,
        email: client.email
    })
})

export const sendOtp = asyncHanndler(async(req,res)=>{
    const {email} = req.body

    const client = await Client.findOne({email})

    if(!client){
        res.status(400)
        throw new Error("Email not found!")
    }

    const otp = getRandom(5)

    const token = jwt.sign(
        {
            "UserInfo": {
                "id": client._id,
            }
        },
        'process.env.TOKEN_SECRET',
        {expiresIn: '5m'}
    )
    await Otp.findOneAndDelete({email})
        const storeOtp = await Otp.create({
            email: email,
            otp: otp,
            token: token
        })

        if(storeOtp){
            try {
                const subject = "TELKOMSERVE Verification Code"
                const message = verificationTemplate({email, verificationCode: otp})
                const recipient = email
                const send_from = `TELKOMSERVE <telkomserve@zohomail.com>`
                await sendEmail(subject, message, recipient, send_from, '', '')
                res.status(200).json({
                    msg: "OTP sent",
                })
            } catch (error) {
                res.status(400)
                throw new Error(error)
            }
        }
})

export const checkBills = asyncHanndler(async(req,res)=>{
    const {accountNumber, otp} = req.body

    if(!otp || !accountNumber){
        res.status(400)
        throw new Error("Missing required fields")
    }

    const OTP = await Otp.findOne({otp})
    if(!OTP){
        res.status(400)
        throw new Error("Invalid OTP")
    }
    try {
        jwt.verify(OTP.token, 'process.env.TOKEN_SECRET')
        const response = await InvoiceModel.find({"client.accountNumber" : accountNumber})
        res.status(200).json(response)
    } catch (error) {
        res.status(400)
        throw new Error("OTP Expired")
    }
})

export const createSOAPdf = asyncHanndler(async(req, res, next)=>{
    const {data} = req.body

    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=soa.pdf'
    })

    generateSOAPdf(data,
        (chunk) => stream.write(chunk),
        () => stream.end()
    )
    // pdfService.generatePdf(
    //     (chunk) => stream.write(chunk),
    //     () => stream.end()
    // )
})