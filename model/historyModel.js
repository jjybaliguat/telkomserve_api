import mongoose from "mongoose";


const historySchema = mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
})

const History = mongoose.model("history", historySchema)

export default History;