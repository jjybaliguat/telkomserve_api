import mongoose from "mongoose";

const toCreateInvoiceSchema = mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    }
})


const ToCreateInvoice = mongoose.model("ToCreateInvoice", toCreateInvoiceSchema)
export default ToCreateInvoice