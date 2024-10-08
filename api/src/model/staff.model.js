import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const staffSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'accountant'],
            required: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
        },
        employeeId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

staffSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

staffSchema.methods.isPasswordCorrect = async function(enteredPassword){
    if (!enteredPassword || !this.password) {
        console.log(enteredPassword);
        console.log(this.password);
        throw new Error('Missing password data for comparison');
      }
    return await bcrypt.compare(enteredPassword, this.password)
}

staffSchema.methods.generateAccessToken = function(){
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

staffSchema.methods.generateRefreshToken = function(){
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

export const Staff = mongoose.model("Staff", staffSchema)
