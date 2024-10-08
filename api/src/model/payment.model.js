import mongoose,{Schema} from "mongoose";

const paymentSchema = new Schema({

    studentId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        required: true,
        enum: ["online", "cash", "cheque"]
    }
},{
    timestamps: true
})

export const Payment = mongoose.model("Payment",paymentSchema);