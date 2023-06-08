import mongoose from "mongoose";


const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
    }
})

const Otp = mongoose.model("otp", otpSchema)

export default Otp;