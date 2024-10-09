import mongoose,{Schema} from "mongoose";

const paymentSchema = new Schema({

    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student"
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
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