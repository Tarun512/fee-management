import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { type } from "os";
import { FeeStructure } from "./feeStructure.model.js";

const studentSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["Student"],
            default: "Student"
        },
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
        totalFeesPaid: {
            type: Number,
            default: 0
        },
        fine: {
            type: Number,
            default: 0
        },
        paymentHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Payment"
            }
        ],
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

studentSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

studentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

studentSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            role: this.role
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Student = mongoose.model("Student", studentSchema)