import mongoose,{Schema} from "mongoose";

const paymentSchema = new Schema({

    reg_no: {
        type: Schema.Types.ObjectId,
        ref: "Student"
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        required: trusted
    },
    mode: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

export const Payment = new mongoose.model("Payment",paymentSchema);