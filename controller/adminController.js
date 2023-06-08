import asyncHanndler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../model/adminModel.js'
import adminToken from '../model/adminToken.js'
import crypto from 'crypto'

// const generateToken = (id) => {
//     return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
// }

export const createAdmin = asyncHanndler(async (req, res) => {
    let {name, email, password, role, photo, phone, address} = req.body

    if(!name || !email || !role || !phone) {
        res.status(400)
        throw new Error("Please fill all required Fields")
    }
    if(!password) {
        password = "admin12345"
    }

    //check if the email

    const emailExists = await Admin.findOne({email})

    if(emailExists) {
        res.status(400)
        throw new Error("Email Already Exist")
    }

    //create new admin

    const admin = await Admin.create({
        name,
        email,
        role,
        phone,
        address,
        password,
        photo
    })

    //Generate Token
    // const token = generateToken(admin._id)

    // //Send HTTP-only cookie
    // res.cookie("token", token, {
    //     httpOnly: true,
    //     expires: new Date(Date.now() + 1000 * 86400), //1 day
    //     sameSite: "none",
    //     secure: false,
    // })

    if(admin) {
        const {_id, name, email, phone, role, photo, address} = admin

        res.status(201).json({
            _id, name, email, phone, role, photo, address
        })
    }

})

export const login = asyncHanndler( async(req, res) => {
    const {email, password} = req.body
    const tokenSecret = process.env.TOKEN_SECRET
    const refreshSecret = process.env.REFRESH_SECRET
    //validate
    if(!email || !password) {
        res.status(400)
        throw new Error("Please enter email or password")
    }

    //check if email exist

    const admin = await Admin.findOne({email}).exec()

    if(!admin) {
        res.status(400)
        throw new Error("Account not found")
    }

    const passwordIsCorrect = await bcrypt.compare(password, admin.password)

    if(admin && passwordIsCorrect) {

          //generate token
    const token = jwt.sign(
        {
            "UserInfo": {
                "id": admin._id,
                "role": admin.role
            }
        },
        'process.env.TOKEN_SECRET',
        {expiresIn: '15m'}
    )
    //Send HTTP-only cookie
    const refreshToken = jwt.sign(
        {
            "id": admin._id,
        },
        'process.env.REFRESH_SECRET',
        {expiresIn: '1d'}
    )
    res.cookie("jwt", refreshToken, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 604800), //1day
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    
        const {_id, name, email, role, photo, createdAt} = admin
        res.status(200).json({
            user: {_id, 
            name, 
            email, 
            role, 
            photo,
            createdAt
            },
            token: token
        })
    }else{
        res.status(400)
        throw new Error("Invalid Email or Password")
    }
 })

 export const refresh = asyncHanndler( async(req, res) => {
    const cookies = req.cookies
    const tokenSecret = process.env.TOKEN_SECRET
    const refreshSecret = process.env.REFRESH_SECRET

    if (!cookies?.jwt){
        res.status(401)
        throw new Error('Unauthorized')
    }

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        'process.env.REFRESH_SECRET',
        async (err, decoded) => {
            if (err) return res.status(403).json({message: "Forbidden"})


            const foundUser = await Admin.findById(decoded.id).exec()

            if (!foundUser) return res.status(401).json({message: "Unauthorized"})

            const token = jwt.sign(
                {
                    "UserInfo": {
                        "id": foundUser._id,
                        "role": foundUser.role
                    }
                },
                'process.env.TOKEN_SECRET',
                { expiresIn: '15m' }
            )
            const {_id, name, email, role, photo} = foundUser
            res.status(200).json({
                user: {
                    _id, 
                    name, 
                    email, 
                    role, 
                    photo,
                },
                token: token
            })
        }
    )
})

 export const logout = asyncHanndler( async(req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
 })

 export const getAdmin = asyncHanndler( async(req, res) => {
    const admin = await Admin.findById(req.user)

    if(admin) {
        const {_id, name, email, role, photo} = admin
        res.status(200).json({
            user: {
                _id, 
                name, 
                email, 
                role, 
                photo
            }
        })
    }else{
        res.status(400)
        throw new Error("Admin not found")
    }
 })
 export const getSingleAdmin = asyncHanndler( async(req, res) => {
    const {id} = req.params
    const admin = await Admin.findById(id)
    if(admin) {
        const {_id, name, email, role, photo} = admin
        res.status(200).json(admin)
    }else{
        res.status(400)
        throw new Error("Admin not found")
    }
 })
 export const getAllAdmin = asyncHanndler( async(req, res) => {
    const admins = await Admin.find({})
    res.status(200).json(admins)
 })

 export const updateAdmin = asyncHanndler( async(req, res) => {
    const admin = await Admin.findById(req.user)

    if(admin){
        const { newEmail, newPhoto, currentPass} = req.body
        const {name, email, role, password, photo} = admin

        if(newEmail !== email){
            const checkEmailExist = await Admin.findOne({email: newEmail})
            if(checkEmailExist){
                res.status(400)
                throw new Error("Email already taken")
            }
        }
        if(currentPass){
            const matched = await bcrypt.compare(currentPass, admin.password)
            console.log(matched);
            if(!matched){
                res.status(400)
                throw new Error("Invalid current password!")
            }
        }
        admin.name = req.body.name || name
        admin.photo = newPhoto || photo
        admin.email = newEmail || email
        admin.role = req.body.role || role
        admin.password = req.body.password || password

        const updatedAdmin = await admin.save()

        res.status(200).json({
            user : {
                _id: updatedAdmin._id,
                name: updatedAdmin.name,
                email: updatedAdmin.email, 
                role: updatedAdmin.role, 
                photo: updatedAdmin.photo,
            }
        })
    }else{
        res.status(404)
        throw new Error("Admin account not found")
    }
 })

 //get login status
export const loginStatus = asyncHanndler( async (req, res) => {
    const token = req.cookies.jwt
    if(!token){
        return res.json({
            logged_in: false
        })
    }else{
        const verified = jwt.verify(token, "process.env.REFRESH_SECRET")
        if(verified){
            return res.json({
                logged_in: true
            })
        }else{
            return res.json({
                logged_in: false
            })
        }
    }
})


 export const deleteAdmin = asyncHanndler( async(req, res) => {
    const {id:adminId} = req.params

    const adminDelete = await Admin.findByIdAndDelete({_id:adminId})
    if(adminDelete){
        res.status(200).json({
            msg: "Account deleted successfullly"
        })
    }else{
        res.status(400).json({
            msg: "Faailed deleting account"
        })
    }
 })

 export const forgotPassword =  asyncHanndler( async(req, res) => {
    const {email} = req.body

    const admin = await Admin.findOne({email})

    if(!admin) {
        res.status(404)
        throw new Error("Admin account does not exist")
    }
    let token = await adminToken.findOne({adminId: admin._id})

    if(token){
        await token.deleteOne()
    }
    //create a reset token
    let resetToken = crypto.randomBytes(32).toString("hex") + admin._id
    console.log(resetToken);
    //hash token before saving to db
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

        ///save token to db
    await new adminToken({
        adminId: admin._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000), //30 minutes
    }).save()

    //construct reset url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

    //reset email

    const message =  `
        <h2>Hello ${admin.name}</h2>
        <p>Please use the url below to reset your password</p>
        <p>This is valid only for 30 minutes</p>

        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

        <p>Regards.</p>
        <p>Cam2net Team</p>
    `
    const subject = "Cam2net Reset Password Request"
    const send_to = admin.email
    const send_from = process.env.EMAIL_USER

    try {
        await sendEmail(subject, message, send_to, send_from)
        res.status(200).json({success: true, message: "reset email Sent"})
    } catch (error) {
        res.status(500)
        throw new Error("Email not sent, please try again")
    }

 })

 export const resetPassword = asyncHanndler( async (req, res) => {
    const { password } = req.body
    const { resetToken } = req.params
    
    //hash token, then compare to the databasee
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    //find token in DB
    const Token = await adminToken.findOne({
        token: hashedToken,
        expiresAt: {$gt: Date.now()}
    })

    if(!Token){
        res.status(404)
        throw new Error("Invalid or token Expired")
    }

    //find admin
    const admin = await Admin.findOne({_id: Token.adminId})

    admin.password = password
    await admin.save()

    res.status(200).json({
    message: "Password Reset successfully, Please Login"
        })
})
