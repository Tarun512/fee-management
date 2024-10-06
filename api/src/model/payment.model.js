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
        type: Number,
        required: true
    },
    mode: {
        type: String,
        required: true,
        enum: ["Online", "Cash", "Cheque"]
    }
},{
    timestamps: true
})

export const Payment = mongoose.model("Payment",paymentSchema);