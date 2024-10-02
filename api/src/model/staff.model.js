import mongoose, {Schema} from "mongoose";

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
            enum: ['Admin', 'Accountant'],
            required: true
        },
        employeeId: {
            type: String,
            required: true,
            unique: true
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

staffSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
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
