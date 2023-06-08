import asyncHanndler from 'express-async-handler'
import Admin from '../model/adminModel.js'
import jwt from 'jsonwebtoken'

export const adminProtect = asyncHanndler( async (req, res, next) => {
    try {
        const Token = req.cookies.token

        if(!Token){
            res.status(401)
            throw new Error("Not authorized, please login")
        }

        //verify token 
        const verified = jwt.verify(Token, process.env.JWT_SECRET)

        //get admin id from token
        const admin = await Admin.findById(verified.id).select("-password")

        if(!admin){
            res.status(401)
            throw new Error("Admin account not found")
        }

        req.admin = admin
        next()

    } catch (error) {
        res.status(400).json({
            msg: "Something went wrong"
        })
    }
})