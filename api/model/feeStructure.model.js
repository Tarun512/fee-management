import mongoose,{Schema} from "mongoose";

const feeStructureSchema = new Schema(
    {
        name: {
            type: String,
            required: true
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
            tpe: Number,
            required: true
        },
        totalFees: {
            type: Number,
            required: true
        },
        totalRegFees: {
            type: Number,
            required: true
        },
        fine: {
            type: Number,
            required: true
        },
        enrolled: [
            {
                type: Schema.Types.ObjectId,
                ref: "Student"
            }
        ]
    },
    {
        timestamps: true
    }
)
export const feeStructure = mongoose.model("FeeStructure",feeStructureSchema);