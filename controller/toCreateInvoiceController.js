import asyncHanndler from 'express-async-handler'
import mongoose from 'mongoose'
import ToCreateInvoice from '../model/toCreateInvoiceClient.js'

export const create = asyncHanndler(async(req,res)=>{
    
    const client = await ToCreateInvoice.create(req.body)
    if(client){
        res.status(200).json(client)
    }
})

export const fetch = asyncHanndler(async(req,res)=>{
    const clients = await ToCreateInvoice.find({})
    
    res.status(200).json(clients)
})

export const deleteOne = asyncHanndler(async(req,res)=> {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No job-order with that id')
    const client = await ToCreateInvoice.findOneAndDelete({clientId: id})

    res.status(200).json({
        msg: "Successfully deleted"
    })
})