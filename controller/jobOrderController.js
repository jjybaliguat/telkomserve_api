import asyncHanndler from 'express-async-handler'
import mongoose from 'mongoose'
import JobOrderModel from '../model/jobOrder.js'

export const createJobOrder = asyncHanndler(async(req,res)=>{
    const joborder = req.body

    const newJobOrder = await JobOrderModel.create(joborder)
    if(newJobOrder){
        res.status(200).json(newJobOrder)
    }
})

export const getJobOrderCount = asyncHanndler(async (req, res) => {
    const totalCount = await JobOrderModel.countDocuments({})
    res.status(200).json(totalCount);
})

export const getAllJobOrder = asyncHanndler(async (req, res) => {
    const alljobOrder = await JobOrderModel.find({}).sort({_id:-1})
    res.status(200).json(alljobOrder)
})

export const getjobOrderById = asyncHanndler(async (req, res) => {
    const { id } = req.params;

    const joborder = await JobOrderModel.findById(id)
    res.status(200).json(joborder)
})

export const updateJobOrder = asyncHanndler(async (req, res) => {
    const { id: _id } = req.params
    const joborder = req.body.data

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No job-order with that id')

    const updatedJobOrder = await JobOrderModel.findByIdAndUpdate(_id, {...joborder, _id}, { new: true})
    res.status(200).json(updatedJobOrder)
})

export const deleteJobOrder = asyncHanndler(async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No job-order with that id')

    await JobOrderModel.findByIdAndRemove(id)
    res.json({
        message: "Job-Order Deleted Successfully"
    })
})