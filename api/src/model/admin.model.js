import mongoose, {Schema} from "mongoose";

const adminSchema = new Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true
        },
        userDetails: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

export const Admin = mongoose.model("Admin", adminSchema)