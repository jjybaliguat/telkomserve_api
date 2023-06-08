import mongoose from "mongoose";

const ServiceableSchema = mongoose.Schema({
    city: {
        type: String,
        required: [true, 'barangay name is required']
    },
    barangay: {
        type: String,
        required: [true, 'barangay name is rrequired']
    },
    areas: [
            {
                name: String,
            }
        ],
})

const Serviceable = mongoose.model('ServiceableArea', ServiceableSchema)
export default Serviceable