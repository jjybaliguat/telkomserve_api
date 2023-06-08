import mongoose from "mongoose";

const jobOrderSchema = mongoose.Schema({
    items: [ 
        { 
            description: String, 
            price: String, 
            discount: String, 
            amount: String 
        } ],
    rates: String,
    vat: Number,
    total: Number,
    subTotal: Number,
    notes: {
        type: String,
        default: ''
    },
    status: String,
    jobOrderNumber: String,
    installationDate: Date,
    refNumber: String,
    applicant: { _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    }, name: String, accountNumber: String, email: String, phone: String, address: String, internetPlan: String},
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const JobOrderModel = mongoose.model("JobOrders", jobOrderSchema)
export default JobOrderModel