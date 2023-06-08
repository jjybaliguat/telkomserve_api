import axios from 'axios'
import asynchandler from 'express-async-handler'
import dayjs from 'dayjs'

export const sendSms = asynchandler(async(req,res) => {
    const {message, recipients} = req.body

    if(!message){
        res.status(400)
        throw new Error("message field is required fields")
    }
    if(!recipients){
        res.status(400)
        throw new Error("recipients field is required fields")
    }
    const response = await axios.post(`https://api.semaphore.co/api/v4/messages?apikey=${process.env.SMS_API_KEY}&message=${message}&number=${recipients}`)

    if(response.data){
        res.status(200).json(response.data)
    }else{
        res.status(400)
        throw new Error("Something went wrong")
    }
})

export const retrieveSms = asynchandler(async(req,res) => {
        const monthNow = dayjs().month()
        const today = dayjs().format("YYYY-MM-DD")
        const prevMonth = dayjs().month(monthNow-1).format("YYYY-MM-DD")

        const response = await axios.get(`https://api.semaphore.co/api/v4/messages?apikey=${process.env.SMS_API_KEY}&startDate=${prevMonth}&endDate=${today}`)

        if(response.data){
            res.status(200).json(response.data)
        }else{
            res.status(400)
            throw new Error("Something went wrong")
        }
})

export const getSmsAccount = asynchandler(async(req,res)=>{
    
    const response = await axios.get(`https://api.semaphore.co/api/v4/account?apikey=${process.env.SMS_API_KEY}`)
    if(response.data){
        res.status(200).json(response.data)
    }else{
        res.status(400)
        throw new Error("Something went wrong")
    }
})