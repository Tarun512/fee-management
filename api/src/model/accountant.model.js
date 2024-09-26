import mongoose,{Schema} from "mongoose";

const accountantSchema = new Schema(
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

export const Accountant = mongoose.model("Accountant", accountantSchema)