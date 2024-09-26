import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { type } from "os";
import { FeeStructure } from "./feeStructure.model.js";

const studentSchema = new Schema(
    {
        registrationId: {
            type: String,
            required: true,
            unique: true
        },
        school: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        batch: {
            type: Number,
            required: true
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'feeStructure'
        },
        history: [
            {
                type: Schema.Types.ObjectId,
                ref: "Payment"
            }
        ]

    },
    {
        timestamps: true
    }
)



export const Student = mongoose.model("Student", studentSchema)