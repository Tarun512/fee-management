<<<<<<< HEAD:api/model/user.model.js
import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { type } from "os";
=======
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
>>>>>>> 43d819f93c23c53827291fa055cdd25e4c6204a4:api/src/model/user.model.js

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
<<<<<<< HEAD:api/model/user.model.js
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
=======
            trim: true
>>>>>>> 43d819f93c23c53827291fa055cdd25e4c6204a4:api/src/model/user.model.js
        },
        email: {
            type: String,
            required: true,
<<<<<<< HEAD:api/model/user.model.js
            unique: true,
            lowecase: true,
            trim: true, 
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String
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

=======
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true
        },
        roleDetails: {
            type: Schema.Types.ObjectId,
            refpath: 'role'
        },
        refreshToken: {
            type: String
        }
    },{
        timestamps: true
    }
)
>>>>>>> 43d819f93c23c53827291fa055cdd25e4c6204a4:api/src/model/user.model.js
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
<<<<<<< HEAD:api/model/user.model.js
=======
            role: this.role
>>>>>>> 43d819f93c23c53827291fa055cdd25e4c6204a4:api/src/model/user.model.js
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
<<<<<<< HEAD:api/model/user.model.js

export const User = mongoose.model("user", userSchema)
=======
export const User = mongoose.model("User",userSchema)
>>>>>>> 43d819f93c23c53827291fa055cdd25e4c6204a4:api/src/model/user.model.js
