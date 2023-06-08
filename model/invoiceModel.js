import mongoose from 'mongoose'

const InvoiceSchema = mongoose.Schema({
    dueDate: Date,
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
    invoiceNumber: String,
    type: String,
    creator: String,
    totalAmountReceived: Number,
    client: { name: String, accountNumber: String, email: String, phone: String, address: String, internetPlan: String},
    paymentRecords: [ {clientName: String, amountPaid: Number, datePaid: Date, paymentMethod: String, note: String, paidBy: String, 
        createdAt: {
        type: Date,
        default: new Date()
    } } ],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const InvoiceModel = mongoose.model('Invoices', InvoiceSchema)
export default InvoiceModel