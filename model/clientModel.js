import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

function getRandom(length) {
    return `01${Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1))}`;
}

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "last name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        // required: [true, "password is Required"],
        minLenght: [6, "Password is at least 6 characters"],
        maxLenght: [23, "Password must not be more than 23 characters"],
    },
    accountNumber: {
        type: String,
        default: getRandom(8)
    },
    phone: {
        type: String,
        required: [true, "Please enter a phone number"],
    },
    nationality: {
        type: String,
        default: "none"
    },
    civilStatus: {
        type: String,
        default: "none"
    },
    fbname: {
        type: String,
        default: "none"
    },
    photo: {
        type: String,
        // required: [true, "Please upload your Id Picture"],
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
    },
    idPic: {
        type: String,
        // required: [true, "Please upload your Id Picture"],
        default: "https://www.svgrepo.com/show/300945/id-card-identification.svg"
    },
    housePic: {
        type: String,
        required: [true, "Please upload a picture of client house"],
        default: "https://cdn-icons-png.flaticon.com/512/25/25694.png"
    },
    address: {
        type: String,
        required: [true, "Please enter your current address"],
    },
    // validIdType: {
    //     type: String,
    //     // required: [true, "Please enter your current address"],
    //     default: null
    // },
    province: {
        type: String,
        default: "none"
    },
    municipality: {
        type: String,
        default: "none"
    },
    brgy: {
        type: String,
        default: "none"
    },
    area: {
        type: String,
        default: "none"
    },
    internetPlan: {
        type: String,
        required: [true, "Please choose an Internet Plan"],
        default: "none"
    },
    dueDate: {
        type: Number,
        // required: [true, "Please enter a due Date"],
        default: null
    },
    installationBalance: {
        type: Number,
        // required: [true, "Please enter am installation Balance"],
        default: null
    },
    installationDate: {
        type: String,
        default: null
    },
    connectionStatus: {
        type: String,
        default: "pending"
    },
    verificationCode: {
        type: String,
        default: getRandom(5)
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
}
)

clientSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})

const Client = mongoose.model("Client", clientSchema)

export default Client;