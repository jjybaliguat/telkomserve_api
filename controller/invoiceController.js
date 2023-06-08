
import asyncHanndler from 'express-async-handler'
import InvoiceModel from '../model/invoiceModel.js'
import mongoose from 'mongoose'

export const createInvoice = asyncHanndler(async (req, res) => {
    const invoice = req.body

    const newInvoice = await InvoiceModel.create(invoice)

    if(newInvoice){
        res.status(200).json(newInvoice)
    }
})

export const getTotalCount = asyncHanndler(async (req, res) => {
    const totalCount = await InvoiceModel.countDocuments({})
    res.status(200).json(totalCount);
})

export const getAllInvoice = asyncHanndler(async (req, res) => {
    const allInvoice = await InvoiceModel.find({}).sort({_id:-1})
    res.status(200).json(allInvoice)
})
export const getInvoiceById = asyncHanndler(async (req, res) => {
    const { id } = req.params;

    const invoice = await InvoiceModel.findById(id)

    res.status(200).json(invoice)
})

export const updateInvoice = asyncHanndler(async (req, res) => {
    const { id: _id } = req.params
    const invoice = req.body.data

    // console.log(invoice)
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No invoice with that id')

    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(_id, {...invoice, _id}, { new: true})
    res.status(200).json(updatedInvoice)
})

export const deleteInvoice = asyncHanndler(async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No invoice with that id')

    await InvoiceModel.findByIdAndRemove(id)
    res.json({
        message: "Invoice Deleted Successfully"
    })
})

