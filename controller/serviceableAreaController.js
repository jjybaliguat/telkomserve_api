import asyncHanndler from 'express-async-handler'
import mongoose from 'mongoose'
import Serviceable from '../model/serviceableArea.js'

export const addServiceableArea = asyncHanndler(async(req, res) => {
    const { city, barangay, mun_code, areas} = req.body

    if(!city || !barangay || !mun_code){
        res.status(400)
        throw new Error("Please fill all required fields")
    }

    const area = await Serviceable.create({
        city,
        barangay,
        mun_code,
        areas
    })

    if(area){
        res.status(200).json(area)
    }else{
        res.status(400)
        throw new Error("Invalid Data")
    }
})

export const getAreabymuncode = asyncHanndler(async(req, res) => {
    const {barangay} = req.params
    const area = await Serviceable.find({barangay})

    if(area){
        res.status(200).json(area)
    }else{
        res.status(400)
        throw new Error(`No avalable area`)
    }

})