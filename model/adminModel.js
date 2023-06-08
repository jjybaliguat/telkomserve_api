import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"]
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
    phone: {
        type: String,
        required: [true, "Phone Number is Required"]
    },
    address: {
        type: String,
    },
    // gender: {
    //     type: String,
    // },
    // dob: {
    //     type: Date
    // },
    password: {
        type: String,
        minLenght: [6, "Password is at least 6 characters"],
        maxLenght: [23, "Password must not be more than 23 characters"],
    },
    role: {
        type: String,
        default: "Super Admin"
    },
    photo: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
    },
    // salary: {
    //     type: Number,
    // },
    // employmentStatus: {
    //     type: String,
    //     default: "active"
    // },
},
{
    timestamps: true,
}
)

adminSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})

const Admin = mongoose.model("Admin", adminSchema)

export default Admin;